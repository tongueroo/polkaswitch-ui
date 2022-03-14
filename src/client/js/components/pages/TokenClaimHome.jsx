// import React, { useEffect, useContext } from 'react';
// import { ethers } from "ethers";
// import { PieChart } from 'react-minimal-pie-chart';
// import Navbar from '../partials/navbar/Navbar';
// import ConnectWalletModal from '../partials/ConnectWalletModal';
// import TxHistoryModal from '../partials/TxHistoryModal';
// import NotificationSystem from '../partials/NotificationSystem';
// import MobileMenu from '../partials/navbar/MobileMenu';
// import NetworkPrice from '../partials/wallet/NetworkPrice';
// import TokenClaimDisconnectedWallet from '../partials/wallet/TokenClaimDisconnectedWallet';
// import EmptyBalances from '../partials/wallet/EmptyBalances';
// import { balanceContext } from '../../context/balance';

// import TokenClaim from '../../utils/tokenClaim';
// import Wallet from '../../utils/wallet';
// import TokenListManager from '../../utils/tokenList';
// import EventManager from '../../utils/events';

// const TokenClaimHome = () => {
//   const {
//     currentNetwork,
//     balances,
//     loading,
//     setMyApplicationState,
//     loadBalances,
//   } = useContext(balanceContext);

//   let subWalletChange;

//   useEffect(() => {
//     setMyApplicationState((prevState) => ({
//       ...prevState,
//       currentNetwork: TokenListManager.getCurrentNetworkConfig(),
//       refresh: Date.now(),
//       balances: [],
//       loading: true,
//     }));

//     loadBalances();
//   }, []);

//   const handleWalletChange = () => {
//     setMyApplicationState((prevState) => ({
//       ...prevState,
//       refresh: Date.now(),
//       balances: [],
//       loading: true,
//     }));

//     loadBalances();
//   };

//   useEffect(() => {
//     subWalletChange = EventManager.listenFor(
//       'walletUpdated',
//       handleWalletChange,
//     );

//     return () => subWalletChange.unsubscribe();
//   }, []);

//   const handleConnect = () => {
//     EventManager.emitEvent('promptWalletConnect', 1);
//   };

//   const claimTokens = async () => {
//     try {
//       const result = await TokenClaim.claimTokens();
//       console.log("token claim", result)
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   const renderTokenClaimHome = () => {
//     if (Wallet.isConnectedToAnyNetwork()) {
//       if (!balances.length && currentNetwork === undefined) {
//         return <EmptyBalances />;
//       }
//       return (
//         <div className="columns is-centered">
//           <div className='column token-claim-column'>
//             <div className="page page-view-order">
//               <div className="page-inner">
//                 <div className="card token-claim-card">
//                   <div className="tokens-table-title-container">
//                     <div className='token-claim-container'>
//                       <div className='token-claim-detail-section token-claim-section'>
//                         <div className='token-claim-info'>
//                           <p className='token-claim-info-title'>Claim Your Swing</p>
//                           <p className='token-claim-info-token'>Token symbol: $SWING</p>
//                         </div>
//                         <div className="solid"></div>
//                         <div className='token-claim-detail'>
//                           <div className='token-claim-detail-text'>
//                             <p className='token-claim-detail-label'>Unlocked</p>
//                             <p className='token-claim-detail-amount'>{TokenClaim.unlocked()}</p>
//                           </div>
//                           <div className='token-claim-detail-text'>
//                             <p className='token-claim-detail-label'>Claimed</p>
//                             <p className='token-claim-detail-amount'>{TokenClaim.claimed()}</p>
//                           </div>
//                           <div className='token-claim-detail-text'>
//                             <p className='token-claim-detail-label'>Locked</p>
//                             <p className='token-claim-detail-amount'>{TokenClaim.locked()}</p>
//                           </div>
//                         </div>
//                         <div className="solid"></div>
//                         <div className='token-claim-action-container'>
//                           <button
//                             className="button token-claim-btn outlined-btn"
//                           >
//                             View Contract
//                           </button>
//                           <button
//                             className="button is-success token-claim-btn"
//                             onClick={claimTokens}
//                           >
//                             Claim Tokens
//                           </button>
//                         </div>
//                         <div className='token-claim-detail-contact'>
//                           <p>Having issues claiming your Swing Tokens?</p>
//                           <p className='token-claim-contact-us'>Contact us on Telegram</p>
//                         </div>
//                       </div>

//                       <div className='token-claim-chart-section token-claim-section'>
//                         <div className='token-claim-pie-chart'>
//                           <PieChart
//                             data={[
//                               { title: 'Claimed', value: 10, color: '#4064D0' },
//                               { title: 'Unlocked', value: 18, color: '#22BA79' },
//                               { title: 'Locked', value: 72, color: '#64586A' },
//                             ]}
//                             lineWidth={40}
//                           />
//                         </div>
//                         <div className="token-claim-chart-info">
//                           <div className="chart-info-section">
//                             <img src="/images/token_claimed.svg" alt="Connect Wallet" />
//                             <p className='chart-label'>Claimed</p>
//                             <p className='chart-percentage claimed-percentage'>{TokenClaim.claimed() / (TokenClaim.locked() + TokenClaim.unlocked()) * 100}%</p>
//                           </div>
//                           <div className="chart-info-section">
//                             <img src="/images/token_unlocked.svg" alt="Connect Wallet" />
//                             <p className='chart-label'>Unlocked</p>
//                             <p className='chart-percentage unlocked-percentage'>{TokenClaim.unlocked() / (TokenClaim.locked() + TokenClaim.unlocked()) * 100}%</p>
//                           </div>
//                           <div className="chart-info-section">
//                             <img src="/images/token_locked.svg" alt="Connect Wallet" />
//                             <p className='chart-label'>Locked</p>
//                             <p className='chart-percentage locked-percentage'>{TokenClaim.locked() / (TokenClaim.locked() + TokenClaim.unlocked()) * 100}%</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return <TokenClaimDisconnectedWallet onClick={handleConnect} />;
//   };

//   return (
//     <div className="container">
//       <Navbar />
//       <MobileMenu />
//       <NotificationSystem />
//       <ConnectWalletModal />
//       <TxHistoryModal />

//       {renderTokenClaimHome()}
//     </div>
//   );
// };

// export default TokenClaimHome;
import React, { useEffect, useContext } from 'react';
import { ethers } from "ethers";
import { PieChart } from 'react-minimal-pie-chart';
import Navbar from '../partials/navbar/Navbar';
import ConnectWalletModal from '../partials/ConnectWalletModal';
import TxHistoryModal from '../partials/TxHistoryModal';
import NotificationSystem from '../partials/NotificationSystem';
import MobileMenu from '../partials/navbar/MobileMenu';
import NetworkPrice from '../partials/wallet/NetworkPrice';
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
  }, []);

  const handleWalletChange = () => {
    setMyApplicationState((prevState) => ({
      ...prevState,
      refresh: Date.now(),
      balances: [],
      loading: true,
    }));

    loadBalances();
  };

  useEffect(() => {
    subWalletChange = EventManager.listenFor(
      'walletUpdated',
      handleWalletChange,
    );

    return () => subWalletChange.unsubscribe();
  }, []);

  const handleConnect = () => {
    EventManager.emitEvent('promptWalletConnect', 1);
  };

  const claimTokens = async () => {
    try {
      const result = await TokenClaim.claimTokens();
      console.log("token claim", result)
    } catch (err) {
      console.log(err);
    }
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
                            <p className='token-claim-detail-amount'>140,000</p>
                          </div>
                          <div className='token-claim-detail-text'>
                            <p className='token-claim-detail-label'>Claimed</p>
                            <p className='token-claim-detail-amount'>60,000</p>
                          </div>
                          <div className='token-claim-detail-text'>
                            <p className='token-claim-detail-label'>Locked</p>
                            <p className='token-claim-detail-amount'>1,150,000</p>
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
                          <p className='token-claim-contact-us'>Contact us on Telegram</p>
                        </div>
                      </div>

                      <div className='token-claim-chart-section token-claim-section'>
                        <div className='token-claim-pie-chart'>
                          <PieChart
                            data={[
                              { title: 'Claimed', value: 10, color: '#4064D0' },
                              { title: 'Unlocked', value: 18, color: '#22BA79' },
                              { title: 'Locked', value: 72, color: '#64586A' },
                            ]}
                            lineWidth={40}
                          />
                        </div>
                        <div className="token-claim-chart-info">
                          <div className="chart-info-section">
                            <img src="/images/token_claimed.svg" alt="Connect Wallet" />
                            <p className='chart-label'>Claimed</p>
                            <p className='chart-percentage claimed-percentage'>10%</p>
                          </div>
                          <div className="chart-info-section">
                            <img src="/images/token_unlocked.svg" alt="Connect Wallet" />
                            <p className='chart-label'>Unlocked</p>
                            <p className='chart-percentage unlocked-percentage'>18%</p>
                          </div>
                          <div className="chart-info-section">
                            <img src="/images/token_locked.svg" alt="Connect Wallet" />
                            <p className='chart-label'>Locked</p>
                            <p className='chart-percentage locked-percentage'>72%</p>
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
      <NotificationSystem />
      <ConnectWalletModal />
      <TxHistoryModal />

      {renderTokenClaimHome()}
    </div>
  );
};

export default TokenClaimHome;
