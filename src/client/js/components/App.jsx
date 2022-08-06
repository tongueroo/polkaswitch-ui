import React, { useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import classnames from 'classnames';
import SwapHome from './pages/SwapHome';
import TokenClaimHome from './pages/TokenClaimHome';
import MetricsDashboardHome from './pages/MetricsDashboardHome';
import BridgeHome from './pages/BridgeHome';
import StatusHome from './pages/StatusHome';
import WalletHome from './pages/WalletHome';
import StakeHome from './pages/StakeHome';
import Footer from './partials/Footer';
import { keepTheme } from '../utils/theme';
import { BalanceProvider } from '../context/balance';
import useLoadBalances from './pages/useLoadBalance';

require('../../css/index.scss');

const IS_CLAIM_DOMAIN = process.env.IS_CLAIM_DOMAIN === 'true';
const IS_METRICS_DOMAIN = process.env.IS_METRICS_DOMAIN === 'true';

console.log(process.env);
console.log(process.env.IS_PRODUCTION);
console.log(process.env.IS_CLAIM_DOMAIN);
console.log(process.env.IS_METRICS_DOMAIN);
console.log(GIT_VERSION);
console.log(GIT_AUTHOR_DATE);
console.log(HEROKU_RELEASE_VERSION);

const App = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenOn = () => setIsFullScreen(true);

  const handleFullScreenOff = () => setIsFullScreen(false);

  useEffect(() => {
    keepTheme();
    window.document.addEventListener('fullScreenOn', handleFullScreenOn);
    window.document.addEventListener('fullScreenOff', handleFullScreenOff);
  }, []);

  useEffect(
    () => () => {
      window.document.removeEventListener('fullScreenOn', handleFullScreenOn);
      window.document.removeEventListener('fullScreenOff', handleFullScreenOff);
    },
    [],
  );

  const { myApplicationState, setMyApplicationState, loadBalances } =
    useLoadBalances();

  var content;

  if (IS_CLAIM_DOMAIN) {
    content = (
      <Switch>
        <Route exact path="/">
          <Redirect to="/claim" />
        </Route>
        <Route path="/claim">
          <TokenClaimHome />
        </Route>
        <Route>
          <Redirect to="/claim" />
        </Route>
      </Switch>
    );

  } else if (IS_METRICS_DOMAIN) {
    content = (
      <Switch>
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
        <Route path="/dashboard">
          <MetricsDashboardHome />
        </Route>
        <Route>
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    );
  } else {
    content = (
      <Switch>
        <Route exact path="/">
          <Redirect to="/swap" />
        </Route>
        <Route path="/swap">
          <SwapHome />
        </Route>
        <Route path="/bridge">
          <BridgeHome />
        </Route>
        <Route path="/stake">
          <StakeHome />
        </Route>
        <Route path="/wallet">
          <WalletHome />
        </Route>
        <Route path="/status">
          <StatusHome />
        </Route>
        <Route path="/claim">
          <TokenClaimHome />
        </Route>
        <Route path="/dashboard">
          <MetricsDashboardHome />
        </Route>
        <Route>
          <Redirect to="/swap" />
        </Route>
      </Switch>
    );
  }

  return (
    <BalanceProvider
      value={{ ...myApplicationState, setMyApplicationState, loadBalances }}
    >
      {myApplicationState && (
        <Router>
          <div className={classnames({ fullscreen: isFullScreen })}>
            {content}
            <Footer />
          </div>
        </Router>
      )}
    </BalanceProvider>
  );
};

export default App;
