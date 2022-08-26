import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import _ from 'underscore';
import { ethers } from 'ethers';
import BN from 'bignumber.js';
import { Integrations } from '@sentry/tracing';

const IS_MAIN_NETWORK = window.IS_MAIN_NETWORK = process.env.IS_MAIN_NETWORK === 'true';
window.IS_PRODUCTION = process.env.IS_PRODUCTION;

if (process.env.IS_PRODUCTION) {
  Sentry.init({
    dsn: process.env.SENTRY_JS_DSN,
    environment: IS_MAIN_NETWORK ? 'production' : 'development',
    integrations: [new Integrations.BrowserTracing()],
    release: `${process.env.HEROKU_APP_NAME}-${process.env.HEROKU_RELEASE_VERSION}`,
    ignoreErrors: [
      // Random plugins/extensions
      "top.GLOBALS",
      // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      "originalCreateNotification",
      "canvas.contentDocument",
      "MyApp_RemoveAllHighlights",
      "http://tt.epicplay.com",
      "Can't find variable: ZiteReader",
      "jigsaw is not defined",
      "ComboSearch is not defined",
      "http://loading.retry.widdit.com/",
      "atomicFindClose",
      // Facebook borked
      "fb_xd_fragment",
      // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
      // reduce this. (thanks @acdha)
      // See http://stackoverflow.com/questions/4113268
      "bmi_SafeAddOnload",
      "EBCallBackMessageReceived",
      // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
      "conduitPage",
    ],
    denyUrls: [
      /health/i
      // Facebook flakiness
      /graph\.facebook\.com/i,
      // Facebook blocked
      /connect\.facebook\.net\/en_US\/all\.js/i,
      // Woopra flakiness
      /eatdifferent\.com\.woopra-ns\.com/i,
      /static\.woopra\.com\/js\/woopra\.js/i,
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // Other plugins
      /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
      /webappstoolbarba\.texthelp\.com\//i,
      /metrics\.itunes\.apple\.com\.edgesuite\.net\/V/i,
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

window.ethers = ethers;
window._ = _;
window.BN = BN;
window.BigNumber = ethers.BigNumber;

if (IS_MAIN_NETWORK) {
  console.log('Loading MAIN config...');
} else {
  console.log('Loading TEST config...');
}

const config = await fetch(
  IS_MAIN_NETWORK ? '/config/main.config.json' : '/config/test.config.json',
);
window.NETWORK_CONFIGS = await config.json();
window.MAX_RETRIES = process.env.IS_PRODUCTION ? 3 : 1;

// import after NETWORK_CONFIGs is initialized
import Wallet from './utils/wallet';
import TokenClaim from './utils/tokenClaim';
import TokenListManager from './utils/tokenList';
import GlobalStateManager from './utils/global';
import SwapFn from './utils/swapFn';
import Nxtp from './utils/nxtp';
import HopUtils from './utils/hop';
import TxQueue from './utils/txQueue';
import Storage from './utils/storage';
import App from "./components/App";

// pre-load and collase/parallelize all our external JSON config loading
// to reduce initial app load times
await Promise.all([
  Wallet.initializeAbis(),
  TokenListManager.initializeTokenLists(),
  TokenClaim.initializeAbi(),
  TokenClaim.initializeAddr(),
]);

await Storage.initialize();
await TokenListManager.initialize();
await TokenListManager.updateTokenList();
await GlobalStateManager.initialize();
await Wallet.initialize();
await TokenClaim.initialize();
await SwapFn.initialize();
await Nxtp.initalize();
await HopUtils.initalize();
TxQueue.initialize();

if (Wallet.isMetamaskSupported()) {
  console.log('MetaMask is installed!');
} else {
  console.error('Metamask not installed!');
}

ReactDOM.render(<App />, document.getElementById('root'));

