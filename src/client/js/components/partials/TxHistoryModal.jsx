/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable wrap-iife */

import React, { useEffect, useState, useRef } from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import EventManager from '../../utils/events';

import TxQueue from '../../utils/txQueue';
import Nxtp from '../../utils/nxtp';

import TxStatusView from './TxStatusView';
import TxCrossChainHistoricalStatusView from './TxCrossChainHistoricalStatusView';
import TxCrossChainActiveStatusView from './TxCrossChainActiveStatusView';
import CrossChainToggle from './swap/CrossChainToggle';
import txBridgeManager, {
  handleFinishActionOfActiveTx,
} from '../../utils/txBridgeManager';

const TxHistoryModal = () => {
  const isMounted = useRef(false);
  const [refresh, setRefresh] = useState(Date.now());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSingleChain, setShowSingleChain] = useState(false);
  const [txAllBridgesHistoryQueue, setTxAllBridgesHistoryQueue] = useState([]);
  const [txAllBridgesActiveQueue, setTxAllBridgesActiveQueue] = useState([]);

  const handleUpdate = () => {
    if (isMounted.current) {
      setRefresh(Date.now());
    }
  };

  const handleClose = (e) => {
    setOpen(false);
    setRefresh(Date.now());
  };

  const handleFinishAction = (
    transactionId,
    bridge,
    estimated,
    sendingChainId,
  ) => {
    if (!Wallet.isConnected()) {
      console.error('TxHistoryModal: Wallet not connected');
      return;
    }

    handleFinishActionOfActiveTx[bridge]?.handleFinishAction(
      transactionId,
      estimated,
      sendingChainId,
    );
  };

  const fetchCrossChainHistory = async () => {
    if (!Wallet.isConnected()) {
      return;
    }

    setLoading(true);

    if (Nxtp.isSdkInitalized()) {
      await Nxtp.initalizeSdk();
    }

    Nxtp.fetchActiveTxs()
      .then(() => Nxtp.fetchHistoricalTxs())
      .then(() => {
        setLoading(false);
        setRefresh(Date.now());
      });
  };

  const handleCrossChainChange = (checked) => {
    setShowSingleChain(checked);

    if (!checked) {
      fetchCrossChainHistory();
    }
  };

  const handleOpen = () => {
    setOpen(true);

    if (!showSingleChain) {
      fetchCrossChainHistory();
    }
  };

  const singleChainQueue = TxQueue.getQueue();

  const xActiveQueue = txAllBridgesActiveQueue.sort(
    (first, second) => second.preparedTimestamp - first.preparedTimestamp,
  );

  const xAllHistQueue = txAllBridgesHistoryQueue.sort(
    (first, second) => second.preparedTimestamp - first.preparedTimestamp,
  );

  const xHistQueue = _.first(xAllHistQueue, 5);

  const emptyQueue =
    (showSingleChain && _.keys(singleChainQueue).length < 1) ||
    (!showSingleChain && xActiveQueue.length < 1 && xHistQueue.length < 1);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false }
  }, []);

  useEffect(() => {
    const subUpdate = EventManager.listenFor('txQueueUpdated', handleUpdate);

    EventManager.listenFor('nxtpEventUpdated', handleUpdate);

    EventManager.listenFor('promptTxHistory', handleOpen);

    return () => subUpdate.unsubscribe();
  }, []);

  useEffect(async () => {
    const resp = await txBridgeManager.getAllTxHistory();
    setTxAllBridgesHistoryQueue(resp);
  }, [loading]);

  useEffect(async () => {
    const resp = await txBridgeManager.getAllActiveTxs();

    setTxAllBridgesActiveQueue(resp);
  }, [refresh, loading]);

  console.log('active', xActiveQueue);
  return (
    <div className={classnames('modal', { 'is-active': open })}>
      <div onClick={handleClose} className="modal-background" />
      <div className="modal-content">
        <div className="tx-history-modal box">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <span
                  className="icon ion-icon clickable is-medium"
                  onClick={handleClose}
                >
                  <ion-icon name="close-outline" />
                </span>
              </div>
              <div className="level-item">
                <b className="widget-title">Transaction History</b>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <CrossChainToggle
                  checked={showSingleChain}
                  handleChange={handleCrossChainChange}
                />
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className={classnames('loader-wrapper', {
                'is-active': loading,
              })}
            >
              <div className="loader is-loading" />
            </div>

            {emptyQueue && (
              <div className="empty-state">
                <div>
                  <div className="empty-text has-text-info">
                    No recent transactions
                  </div>
                  <div className="icon has-text-info-light">
                    <ion-icon name="file-tray-outline" />
                  </div>
                </div>
              </div>
            )}

            {showSingleChain &&
              _.map(singleChainQueue, (item, i) => (
                <TxStatusView key={i} data={item} />
              ))}
            {showSingleChain && _.keys(singleChainQueue).length > 0 && (
              <div className="footer-note">
                Only showing transactions in the last 72 hours.
              </div>
            )}

            {!showSingleChain && (
              <div className="footer-note mb-2">
                {xActiveQueue.length > 0
                  ? 'Current active transactions'
                  : 'No active transactions'}{' '}
                ({xActiveQueue.length})
              </div>
            )}

            {!showSingleChain &&
              xActiveQueue.map((item, i) => (
                <TxCrossChainActiveStatusView
                  key={i}
                  data={item}
                  handleFinishAction={handleFinishAction}
                />
              ))}

            {!showSingleChain && xHistQueue.length > 0 && (
              <div className="footer-note mb-2">
                Last five historical transactions ({xHistQueue.length}/
                {xAllHistQueue.length})
              </div>
            )}

            {!showSingleChain &&
              xHistQueue.map((item, i) => (
                <TxCrossChainHistoricalStatusView key={i} data={item} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxHistoryModal;
