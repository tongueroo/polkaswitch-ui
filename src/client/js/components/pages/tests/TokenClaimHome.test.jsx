import React from 'react';
import { render, screen } from '@testing-library/react';
import TokenClaimHome from '../TokenClaimHome';
import { BrowserRouter } from 'react-router-dom';
import { BalanceProvider } from '../../../context/balance';

const networksMock = [
  {
    enabled: true,
    name: 'Ethereum',
    aggregatorAddress: '0x689236A0C4A391FdD76dE5c6a759C7984166d166',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    bridgeURI: 'https://wallet.matic.network/',
    tokenList: '/tokens/eth.list.json',
    chainId: '1',
    nodeProviders: [
      'https://eth-mainnet.alchemyapi.io/v2/hrkUnlgn_VD_KbxEjpo7D2mVwTfAVUJW',
    ],
    explorerBaseUrl: 'https://etherscan.io/tx/',
    gasApi: 'https://ethgasstation.info/json/ethgasAPI.json',
    color: '#5C69B5',
    desiredParts: 3,
    abi: 'oneSplitAbi',
    chain: {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
    },
    defaultPair: {
      to: 'ETH',
      from: 'USDT',
    },
    topTokens: ['ETH', 'USDT', 'USDC', 'DAI'],
    coingecko: {
      platform: 'ethereum',
    },
    singleChainSupported: false,
    crossChainSupported: true,
    supportedCrossChainTokens: ['USDT', 'USDC', 'DAI'],
  },
];


const mockedBalanceContext = {
  refresh: Date.now(),
  currentNetwork: networksMock[0],
  balances: [],
  loading: true,
  networks: networksMock,
  setMyApplicationState: () => {},
  loadBalances: () => {},
};

describe('<TokenClaimHome />', () => {
  it('Render Title from Token Claim component', () => {
    render(
      <BrowserRouter>
        <BalanceProvider value={mockedBalanceContext}>
          <TokenClaimHome />
        </BalanceProvider>
      </BrowserRouter>,
    );

    const Title = screen.getByText(/Token Claim/i);

    expect(Title).toBeInTheDocument();
  });
});
