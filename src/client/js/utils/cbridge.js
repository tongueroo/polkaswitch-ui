//Celer doc: https://cbridge-docs.celer.network/developer/cbridge-sdk
import HttpUtilis from './http';
import EventManager from './events';
import Wallet from "./wallet";
import TokenListManager from "./tokenList";
import {abi as BridgeABI} from "../../../contract/celer_contract/Bridge.json"
const TokenABI = require("../../../contract/ERC20.json");
import { Contract } from '@ethersproject/contracts';
import _ from "underscore";
import {constants} from "ethers";

window.CBridgeUtils = {
    _client: false,

    _activeTxs: [],
    _historicalTxs: [],

    initialize: async function() {
        EventManager.listenFor('walletUpdated', this.resetClient.bind(this));

        if (Wallet.isConnected()) {
            this._client = await this.initializeClient();
        }
    },

    isClientInitialized: function() {
        return !!this._client;
    },

    initializeClient: async function() {
        //Test celer hostname: https://cbridge-v2-test.celer.network
        const client = this._client = HttpUtilis.initHttp(`https://cbridge-prod2.celer.network`);
        this._attachClientListeners(client);
        return client;
    },

    resetClient: function() {
        console.log("Celer Bridge grpc client reset");

        if (this._client) {
            //detach all listeners
            // TODO
            // this._sdk.removeAllListeners();
            // this._sdk.detach();
        }

        this._client = false;
        this._activeTxs = [];
        this._historicalTxs = [];
    },

    _attachClientListeners: function(_client) {
        if (!_client) {
            return;
        }
    },

    isSupportedAsset: function(sendingAssetId) {
        return true;
    },

    isSupportedNetwork: async function(network) {
        if (!this._client) {
            this._client = await this.initializeClient();
        }

        const config = await this.getTransferConfig();
        const chains = JSON.parse(config).chains
        return chains.some(e => e.name.toLowerCase() === network.name.toLowerCase())
    },

    getTransferConfig: async function () {
        if (!Wallet.isConnected()) {
            console.error("cbridge: Wallet not connected");
            return false;
        }

        if (!this._client) {
            this._client = await this.initializeClient();
        }

        // const request = new GetTransferConfigsRequest();
        // return await this._client.getTransferConfigs(request, null);
        const transferConfig = await this._client.get(`/v1/getTransferConfigs`, null);
        return transferConfig.data;
    },

    getEstimate: async function(
        transactionId,
        sendingChainId,
        sendingAssetId,
        receivingChainId,
        receivingAssetId,
        amountBN,
        receivingAddress
    ) {
        if (!Wallet.isConnected()) {
            console.error("cbridge: Wallet not connected");
            return false;
        }

        if (!this._client) {
            this._client = await this.initializeClient();
        }

        const receivingAsset = TokenListManager.findTokenById(receivingAssetId, receivingChainId);
        const sendingAsset = TokenListManager.findTokenById(sendingAssetId);
        const bridgeAsset = TokenListManager.findTokenById(sendingAssetId, receivingChainId);
        const slippage = 500 //convert percent to int eg: 0.05% = 500; 0.1 = 1000


        const config = {
            params: {
                src_chain_id: sendingChainId,
                dst_chain_id: receivingChainId,
                token_symbol: sendingAsset.symbol,
                amt: amountBN.toString(),
                usr_addr: Wallet.currentAddress(),
                slippage_tolerance: slippage
            }
        }

        const response = await this._client.get(`/v1/estimateAmt`, config)

        console.log(response.data);
        const data = response.data;
        const percFee = parseInt(data.perc_fee);
        const baseFee = parseInt(data.base_fee);
        const amountOut = parseInt(data.estimated_receive_amt);
        return {
            id: transactionId,
            transactionFee: percFee + baseFee,
            returnAmount: amountOut,
            maxSlippage: data.max_slippage
        }
    },

    transferStepOne: async function(
        transactionId,
        sendingChainId,
        sendingAssetId,
        receivingChainId,
        receivingAssetId,
        amountBN,
        receivingAddress,
        maxSlippage
    ) {
        if (!Wallet.isConnected()) {
            console.error("CBridge: Wallet not connected");
            return false;
        }

        if (!this._client) {
            this._client = await this.initializeClient();
        }

        console.log("CBridge: Start transfer step one");
        const sendingAsset = TokenListManager.findTokenById(sendingAssetId);
        const amountToApprove = constants.MaxUint256;
        const signer = Wallet.getProvider().getSigner();
        console.log(sendingAsset.address);

        const tokenContract = new Contract(
            sendingAsset.address,
            TokenABI,
            signer
        );
        const bridgeContractAddr = await this.findBridgeContractAddress(sendingChainId);

        console.debug("CBridge: start approving token");
        ///STEP 1.1: Approve token
        const ownerAddress = await signer.getAddress();

        const allowance = await tokenContract.allowance(
                                            ownerAddress,
                                            bridgeContractAddr);
        var approveTx;
        if (BigNumber.from(allowance).lt(BigNumber.from(amountBN))) {
            approveTx = await tokenContract.approve(bridgeContractAddr, amountToApprove)
        }

        console.log('Cbridge Approved TX: ', approveTx);

        // const provider = new window.ethers.providers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner();
        const bridgeContract = new Contract(
            bridgeContractAddr,
            BridgeABI,
            signer);

        const nonce = Date.now();

        bridgeContract.send(
            ownerAddress,
            sendingAsset.address,
            amountBN,
            receivingChainId,
            nonce,
            maxSlippage
        );

        const transfer_id = window.ethers.utils.solidityKeccak256(
            [
                "address",
                "address",
                "address",
                "uint256",
                "uint64",
                "uint64",
                "uint64"
            ],
            [
                Wallet.currentAddress(), /// User's wallet address,
                Wallet.currentAddress(), /// User's wallet address,
                sendingAsset.address, /// ETH / ERC20 token address
                amountBN.toString(), /// Send amount in String
                receivingChainId, /// Destination chain id
                nonce, /// Nonce
                sendingChainId, /// Source chain id
            ],
        )

        return {
            transactionHash: transfer_id
        };

    },

    findBridgeContractAddress: async function (sendingChainId) {
        const transferConfig = await this.getTransferConfig();
        const chainInfos = transferConfig.chains;
        const chainInfo = _.find(chainInfos, function (c) {
            return c.id === parseInt(sendingChainId);
        })
        if (!chainInfo) {
            console.error("WARN: Cannot find celer bridge contract address")
        }
        return chainInfo.contract_addr;
    },
};

export default window.CBridgeUtils;


