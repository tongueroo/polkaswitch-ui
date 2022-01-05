/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect } from 'react';
import classnames from 'classnames';
import Navbar from '../partials/navbar/Navbar';
import ConnectWalletModal from '../partials/ConnectWalletModal';
import TxHistoryModal from '../partials/TxHistoryModal';
import NotificationSystem from '../partials/NotificationSystem';
import MobileMenu from '../partials/navbar/MobileMenu';
import { balanceContext } from '../../context/balance';

const StatusHome = () => {
  const { networks, loadBalances, loading, setMyApplicationState } =
    useContext(balanceContext);

  useEffect(() => {
    setMyApplicationState((prevState) => ({
      ...prevState,
      refresh: Date.now(),
      balances: [],
      loading: true,
    }));

    loadBalances();
  }, []);

  return (
    <div className="container">
      <Navbar />
      <MobileMenu />
      <NotificationSystem />
      <ConnectWalletModal />
      <TxHistoryModal />

      <div className="columns is-centered">
        <div className="column card-container">
          <div className="card wallets-page-card">
            <div className="tokens-table-title-container">
              <span className="tokens-table-title-container__main">Status</span>
            </div>

            <div className="wallets-page-tokens-table">
              <div className="columns wallets-page-tokens-table__header is-mobile">
                <div className="column is-half-mobile">
                  <span>Node</span>
                </div>
                <div className="column is-half-mobile">
                  <span>Status</span>
                </div>
              </div>
              {loading ? (
                <div
                  className={classnames('wallets-page-loader', {
                    'is-hidden': !loading,
                  })}
                >
                  <div className="loader-text">Loading nodes</div>
                  <div className="loader is-loading" />
                </div>
              ) : networks ? (
                networks.map((node) => (
                  <div
                    key={`network-${node.name}`}
                    className="columns wallets-page-tokens-table__row is-mobile"
                  >
                    <div className="column is-half">
                      <span>{node.name}</span>
                    </div>
                    <div className="column align-right">
                      <h4 className="wallets-page-tokens-table__title">
                        {node.isRPCNodeActive ? (
                          <span className="network-status-online"> Online</span>
                        ) : (
                          <span className="network-status-offline">
                            {' '}
                            Offline
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>
                ))
              ) : (
                "Please reconnect the RPC's"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusHome;
