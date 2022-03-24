import React, { useState, useEffect, useContext } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import Navbar from '../partials/navbar/Navbar';
import ConnectWalletModal from '../partials/ConnectWalletModal';
import TokenClaimResultModal from '../partials/TokenClaimResultModal';
import ErrorModal from '../partials/ErrorModal';
import MobileMenu from '../partials/navbar/MobileMenu';
import TokenClaimDisconnectedWallet from '../partials/wallet/TokenClaimDisconnectedWallet';
import EmptyBalances from '../partials/wallet/EmptyBalances';
import { balanceContext } from '../../context/balance';

import TokenClaim from '../../utils/tokenClaim';
import Wallet from '../../utils/wallet';
import TokenListManager from '../../utils/tokenList';
import EventManager from '../../utils/events';

const TokenClaimHome = () => {
  const {
    currentNetwork,
    balances,
    loading,
    setMyApplicationState,
    loadBalances,
  } = useContext(balanceContext);
  const [tokenInfo, setTokenInfo] = useState({
    claimed: 0,
    locked: 0,
    unlocked: 0,
    claimedPercentage: 0,
    unlockedPercentage: 0,
    lockedPercentage: 0
  });
  const [claimInfo, setClaimInfo] = useState({
    openTokenClaimResultModal: false,
    claimSuccess: false
  })
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  let subWalletChange;

  useEffect(() => {
    setMyApplicationState((prevState) => ({
      ...prevState,
      currentNetwork: TokenListManager.getCurrentNetworkConfig(),
      refresh: Date.now(),
      balances: [],
      loading: true,
    }));

    loadBalances();
    loadTokenInfo();
  }, []);

  useEffect(() => {
    subWalletChange = EventManager.listenFor(
      'walletUpdated',
      handleWalletChange,
    );

    return () => subWalletChange.unsubscribe();
  }, []);

  const handleWalletChange = () => {
    setMyApplicationState((prevState) => ({
      ...prevState,
      refresh: Date.now(),
      balances: [],
      loading: true,
    }));

    loadBalances();
    loadTokenInfo();
  };

  const loadTokenInfo = async () => {
    setIsLoading(true);
    try {
      const claimed = await TokenClaim.claimed();
      const unlocked = await TokenClaim.unlocked();
      const locked = await TokenClaim.locked();
      const total = locked + unlocked + claimed;
  
      const claimedPercentage = total !== 0 ? claimed / total * 100 : 0;
      const unlockedPercentage = total !== 0  ? unlocked / total  * 100 : 0;
      const lockedPercentage = total !== 0 ? locked / total * 100 : 0;
  
      setTokenInfo({
        claimed,
        unlocked,
        locked,
        claimedPercentage,
        unlockedPercentage,
        lockedPercentage
      })
    } catch(err) {
      setHasError(true);
    }
    setIsLoading(false);
  }

  const handleConnect = () => {
    EventManager.emitEvent('promptWalletConnect', 1);
  };

  const claimTokens = async () => {
    try {
      const result = await TokenClaim.claimTokens();

      setClaimInfo({
        openTokenClaimResultModal: true,
        claimSuccess: result === 1
      });
    } catch (err) {
      setClaimInfo({
        openTokenClaimResultModal: true,
        claimSuccess: false
      });
    }
  }
  
  const closeTokenClaimResultModal = () => {
    setClaimInfo({
      openTokenClaimResultModal: false
    });
  }

  const closeErrorModal = () => {
    setHasError(false);
  }

  const renderTokenClaimHome = () => {
    if (Wallet.isConnectedToAnyNetwork()) {
      if (!balances.length && currentNetwork === undefined) {
        return <EmptyBalances />;
      }
      return (
        <div className="columns is-centered">
          <div className='column token-claim-column'>
            <div className="page page-view-order">
              <div className="page-inner">
                <div className="card token-claim-card">
                  <div className="tokens-table-title-container">
                    <div className='token-claim-container'>
                      <div className='token-claim-detail-section token-claim-section'>
                        <div className='token-claim-info'>
                          <p className='token-claim-info-title'>Claim Your Swing</p>
                          <p className='token-claim-info-token'>Token symbol: $SWING</p>
                        </div>
                        <div className="solid"></div>
                        <div className='token-claim-detail'>
                          <div className='token-claim-detail-text'>
                            <p className='token-claim-detail-label'>Unlocked</p>
                            <p className='token-claim-detail-amount'>{isLoading ? <div className="loader"></div> : tokenInfo.unlocked}</p>
                          </div>
                          <div className='token-claim-detail-text'>
                            <p className='token-claim-detail-label'>Claimed</p>
                            <p className='token-claim-detail-amount'>{isLoading ? <div className="loader"></div> : tokenInfo.claimed}</p>
                          </div>
                          <div className='token-claim-detail-text'>
                            <p className='token-claim-detail-label'>Locked</p>
                            <p className='token-claim-detail-amount'>{isLoading ? <div className="loader"></div> : tokenInfo.locked}</p>
                          </div>
                        </div>
                        <div className="solid"></div>
                        <div className='token-claim-action-container'>
                          <button
                            className="button token-claim-btn outlined-btn"
                          >
                            View Contract
                          </button>
                          <button
                            className="button is-success token-claim-btn"
                            onClick={claimTokens}
                          >
                            Claim Tokens
                          </button>
                        </div>
                        <div className='token-claim-detail-contact'>
                          <p>Having issues claiming your Swing Tokens?</p>
                          <a className='token-claim-contact-us' href='https://discord.gg/jQ9Xhdbb'>Contact us on Discord</a>
                        </div>
                      </div>

                      <div className='token-claim-chart-section token-claim-section'>
                        <div className='token-claim-pie-chart'>
                          <PieChart
                            data={[
                              { title: 'Claimed', value: tokenInfo.claimedPercentage , color: '#4064D0' },
                              { title: 'Unlocked', value: tokenInfo.unlockedPercentage, color: '#22BA79' },
                              { title: 'Locked', value: tokenInfo.lockedPercentage, color: '#64586A' },
                            ]}
                            lineWidth={40}
                          />
                        </div>
                        <div className="token-claim-chart-info">
                          <div className="chart-info-section">
                            <img src="/images/token_claimed.svg" alt="Claimed Token" />
                            <p className='chart-label'>Claimed</p>
                            <p className='chart-percentage claimed-percentage'>{isLoading ? <div className="loader"></div> : `${tokenInfo.claimedPercentage}%`}</p>
                          </div>
                          <div className="chart-info-section">
                            <img src="/images/token_unlocked.svg" alt="Unlocked Token" />
                            <p className='chart-label'>Unlocked</p>
                            <p className='chart-percentage unlocked-percentage'>{isLoading ? <div className="loader"></div> : `${tokenInfo.unlockedPercentage}%`}</p>
                          </div>
                          <div className="chart-info-section">
                            <img src="/images/token_locked.svg" alt="Locked Token" />
                            <p className='chart-label'>Locked</p>
                            <p className='chart-percentage locked-percentage'>{isLoading ? <div className="loader"></div> : `${tokenInfo.lockedPercentage}%`}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <TokenClaimDisconnectedWallet onClick={handleConnect} />;
  };

  return (
    <div className="container">
      <Navbar />
      <MobileMenu />
      <ConnectWalletModal />
      <TokenClaimResultModal open={claimInfo.openTokenClaimResultModal} handleClose={closeTokenClaimResultModal} success={claimInfo.claimSuccess}/>
      <ErrorModal open={hasError} handleClose={closeErrorModal} />

      {renderTokenClaimHome()}
    </div>
  );
};

export default TokenClaimHome;
