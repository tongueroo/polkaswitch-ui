import _ from 'underscore';
import EventManager from './events';
import TokenListManager from './tokenList';
import * as ethers from 'ethers';
import Storage from './storage';

let store = require('store');

window.GlobalStateManager = {
  swap: {
    from: {},
    to: {},
  },

  bridge: {
    from: {},
    to: {},
    fromChain: '',
    toChain: '',
  },

  initialize: async function () {  
    const network = TokenListManager.getCurrentNetworkConfig();

    // get swapConfig from localstorage
    const swapConfig = store.get('swap');
    const defaultSwapConfig = {
      from: TokenListManager.findTokenById(network.defaultPair.from),
      to: TokenListManager.findTokenById(network.defaultPair.to),
      fromChain: network.name,
      toChain: network.name,
    };

    const swap = swapConfig ? swapConfig : defaultSwapConfig;
    
    this.updateSwapConfig(swap);

    // init bridgeConfig
    const bridgeConfig = store.get('bridge');
    const crossChainNetworks = _.filter(
      window.NETWORK_CONFIGS,
      (v) => v.enabled && v.crossChainSupported,
    );
    const toChain = crossChainNetworks.find(
      (v) => v.chainId !== network.chainId,
    );

    const fromChain = crossChainNetworks.find((v) => {
      return v.chainId === network.chainId;
    });

    const defaultBridgeConfig = {
      from: TokenListManager.findTokenById(network.supportedCrossChainTokens[0] || network.defaultPair.from),
      to: TokenListManager.findTokenById(toChain.supportedCrossChainTokens[0] || toChain.defaultPair.to, toChain),
      fromChain,
      toChain,
    };

    this.updateBridgeConfig(defaultBridgeConfig);
  },

  updateSwapConfig: function (swap) {
    this.swap = _.extend(this.getSwapConfig(), swap);
    store.set('swap', this.swap);
    EventManager.emitEvent('swapConfigUpdated', 1);
  },

  getSwapConfig: function () {
    return this.swap;
  },

  updateBridgeConfig: function (bridge) {
    this.bridge = _.extend(this.getBridgeConfig(), bridge);
    store.set('bridge', this.bridge);
    EventManager.emitEvent('bridgeConfigUpdated', 1);
  },

  getBridgeConfig: function () {
    return this.bridge;
  },
};

export default window.GlobalStateManager;