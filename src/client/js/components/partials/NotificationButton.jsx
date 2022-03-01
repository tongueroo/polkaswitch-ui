import React, { useEffect, useState } from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import EventManager from '../../utils/events';
import TxQueue from '../../utils/txQueue';

const NotificationButton = () => {
  const handleClick = (e) => {
    EventManager.emitEvent('promptTxHistory', 1);
  };

  const [refresh, setRefresh] = useState(Date.now());
  const [numOfPending, setNumOfPending] = useState([]);

  const handleUpdate = () => {
    setRefresh(Date.now());
  };

  useEffect(async () => {
    const numOfPending = await TxQueue.numOfPending();

    setNumOfPending(numOfPending);
  }, []);

  useEffect(() => {
    let subUpdates = EventManager.listenFor('walletUpdated', handleUpdate);
    let subTxUpdates = EventManager.listenFor('txQueueUpdated', handleUpdate);

    return () => {
      subTxUpdates.unsubscribe();
      subUpdates.unsubscribe();
    };
  }, []);

  const isConnected = Wallet.isConnectedToAnyNetwork();

  return (
    <div
      className={classnames('notification-button', {
        'is-hidden': !isConnected,
      })}
      onClick={() => handleClick()}
    >
      <img src="/images/tx_history.svg" />
      <div
        className={classnames('bubble tag', {
          'is-hidden': numOfPending < 1,
        })}
      >
        {numOfPending}
      </div>
    </div>
  );
};

export default NotificationButton;
