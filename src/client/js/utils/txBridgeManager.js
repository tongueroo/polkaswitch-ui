import _ from 'underscore';
import store from 'store';
import BN from 'bignumber.js';
import { BigNumber, constants, providers, Signer, utils } from 'ethers';

import { getRandomBytes32 } from '@connext/nxtp-utils';
import Wallet from './wallet';
import swapFn from './swapFn';
import HopUtils from './hop';
import CBridgeUtils from './cbridge';
import Nxtp from './nxtp';
import Storage from './storage';

// hard-code for now, the HopSDK has "supportedChains", but let's integrate later.
const HOP_SUPPORTED_CHAINS = [1, 137, 100, 10, 42161];

const CBRIDGE_SUPPORTED_CHAINS = [1, 10, 56, 137, 250, 42161, 43114];

const CONNEXT_SUPPORTED_CHAINS = [1, 56, 137, 100, 250, 42161, 43114];

const CONNEXT_SUPPORTED_BRIDGE_TOKENS = [
  'USDC',
  'USDT',
  'DAI',
  // TODO This is list is longer and is dynamically available per network pair.
  // Let's keep it simple for now
  // ... "MATIC", "ETH", "WBTC", "BNB"
];

// hard-code for now. I could not find this easily as a function in HopSDK
const HOP_SUPPORTED_BRIDGE_TOKENS = [
  'USDC',
  'USDT',
  'DAI',
  // TODO This is list is longer and is dynamically available per network pair.
  // Let's keep it simple for now
  // ... "MATIC", "ETH", "WBTC"
];

const CBRIDGE_SUPPORTED_BRIDGE_TOKENS = [
  'USDC',
  'USDT'
  // TODO This is list is longer and is dynamically available per network pair.
  // Let's keep it simple for now
  // ... "MATIC", "ETH", "WBTC"
];

export default {
  _signerAddress: '',
  _queue: {},

  async initialize() {},

  getBridgeInterface(nonce) {
    const tx = this.getTx(nonce);
    let { bridgeOption } = Storage.swapSettings;

    if (tx?.bridge) {
      bridgeOption = tx.bridge;
    }

    if (bridgeOption === 'hop') {
      return HopUtils;
    }
    if (bridgeOption === 'cbridge') {
      return CBridgeUtils;
    }
    return Nxtp;
  },

  isSupported(to, toChain, from, fromChain) {
    const { bridgeOption } = Storage.swapSettings;

    const targetChainIds = [+toChain.chainId, +fromChain.chainId];

    if (bridgeOption === 'hop') {
      if (!HOP_SUPPORTED_CHAINS.includes(+toChain.chainId)) {
        return [false, `${toChain.name} is not supported by Hop Bridge`];
      }
      if (!HOP_SUPPORTED_CHAINS.includes(+fromChain.chainId)) {
        return [false, `${fromChain.name} is not supported by Hop Bridge`];
      }
      return [true, false];
    }
    if (bridgeOption === 'cbridge') {
      if (!CBRIDGE_SUPPORTED_CHAINS.includes(+toChain.chainId)) {
        return [false, `${toChain.name} is not supported by Celer Bridge`];
      }
      if (!CBRIDGE_SUPPORTED_CHAINS.includes(+fromChain.chainId)) {
        return [false, `${fromChain.name} is not supported by Celer Bridge`];
      }
      return [true, false];
    }
    if (!CONNEXT_SUPPORTED_CHAINS.includes(+toChain.chainId)) {
      return [false, `${toChain.name} is not supported by Connext Bridge`];
    }
    if (!CONNEXT_SUPPORTED_CHAINS.includes(+fromChain.chainId)) {
      return [false, `${fromChain.name} is not supported by Connext Bridge`];
    }
    return [true, false];
  },

  supportedBridges(to, toChain, from, fromChain) {
    const bridges = [];
    const targetChainIds = [+toChain.chainId, +fromChain.chainId];
    const targetTokenIds = [to.symbol, from.symbol];


    if (targetChainIds.every(e => CONNEXT_SUPPORTED_CHAINS.includes(e))) {
      // Connext always supported regardless of token due to the extra swap steps
      bridges.push("connext");
    }

    if (targetChainIds.every(e => HOP_SUPPORTED_CHAINS.includes(e))) {
      if (to.symbol === from.symbol && targetTokenIds.every(e => HOP_SUPPORTED_BRIDGE_TOKENS.includes(e))) {
        bridges.push("hop");
      }
    }

    if (targetChainIds.every(e => CBRIDGE_SUPPORTED_CHAINS.includes(e))) {
      if (to.symbol === from.symbol && targetTokenIds.every(e => CBRIDGE_SUPPORTED_BRIDGE_TOKENS.includes(e))) {
        bridges.push("cbridge");
      }
    }

    return bridges;
  },

  isSwapRequiredForBridge: function(to, toChain, from, fromChain) {
  },

  async getEstimate(
    sendingChainId,
    sendingAssetId,
    receivingChainId,
    receivingAssetId,
    amountBN,
    receivingAddress,
  ) {
    const transactionId = getRandomBytes32();
    const bridgeInterface = this.getBridgeInterface();
    const { bridgeOption } = Storage.swapSettings;

    if (bridgeOption === 'cbridge') {
      const estimate = await this.getBridgeInterface().getEstimate(
        transactionId,
        sendingChainId,
        sendingAssetId,
        receivingChainId,
        receivingAssetId,
        amountBN,
        receivingAddress,
      );
      const { maxSlippage } = estimate;
      this._queue[transactionId] = {
        bridge: bridgeOption,
        sendingChainId,
        sendingAssetId,
        receivingChainId,
        receivingAssetId,
        amountBN,
        receivingAddress,
        maxSlippage,
      };
      return estimate;
    }

    this._queue[transactionId] = {
      bridge: bridgeOption,
      sendingChainId,
      sendingAssetId,
      receivingChainId,
      receivingAssetId,
      amountBN,
      receivingAddress,
    };

    return this.getBridgeInterface().getEstimate(
      transactionId,
      sendingChainId,
      sendingAssetId,
      receivingChainId,
      receivingAssetId,
      amountBN,
      receivingAddress,
    );
  },

  transferStepOne(transactionId) {
    const bridgeInterface = this.getBridgeInterface(transactionId);
    const tx = this.getTx(transactionId);
    return bridgeInterface.transferStepOne(
      transactionId,
      tx.sendingChainId,
      tx.sendingAssetId,
      tx.receivingChainId,
      tx.receivingAssetId,
      tx.amountBN,
      tx.receivingAddress,
      tx.maxSlippage,
    );
  },

  transferStepTwo(transactionId) {
    const bridgeInterface = this.getBridgeInterface(transactionId);
    const tx = this.getTx(transactionId);
    return bridgeInterface.transferStepTwo(
      transactionId,
      tx.sendingChainId,
      tx.sendingAssetId,
      tx.receivingChainId,
      tx.receivingAssetId,
      tx.amountBN,
      tx.receivingAddress,
    );
  },

  twoStepTransferRequired(nonce) {
    const tx = this.getTx(nonce);
    if (!tx) {
      return false;
    }

    return tx.bridge === 'connext';
  },

  getTx(nonce) {
    return this._queue[nonce];
  },
};
