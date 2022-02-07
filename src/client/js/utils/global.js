import _ from 'underscore';
import EventManager from './events';
import TokenListManager from './tokenList';
import * as ethers from 'ethers';
import Storage from './storage';

let store = require('store');

window.GlobalStateManager = {
  // TODO - not a great place to store this state
  swap: {
    from: {},
    to: {},
  },

  initialize: async function () {  
    // TODO need to refactor this
    if (false) {
      // TODO this.isCrossChainEnabled()) {
      // TODO crossChain not supported in TradingView
    } else {
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
    }
  },

  // TODO need to refactor this
  updateSwapConfig: function (swap) {
    this.swap = _.extend(this.getSwapConfig(), swap);
    store.set('swap', this.swap);
    EventManager.emitEvent('swapConfigUpdated', 1);
  },

  getSwapConfig: function () {
    return this.swap;
  },
};

export default window.GlobalStateManager;