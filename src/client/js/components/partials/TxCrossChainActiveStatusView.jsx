/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/button-has-type */

import React from 'react';
import classnames from 'classnames';
import * as ethers from 'ethers';
import numeral from 'numeral';
import dayjs from 'dayjs';

import TokenListManager from '../../utils/tokenList';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const Utils = ethers.utils;

const actionNeededList = [
  'TRANSFER_TO_BE_REFUNDED',
  'ReceiverTransactionPrepared',
];

const TxCrossChainActiveStatusView = ({ data: txData, handleFinishAction }) => {
  if (!txData) {
    return <div />;
  }

  const sendingChain = TokenListManager.getNetworkById(txData.sendingChainId);
  const receivingChain = TokenListManager.getNetworkById(
    txData.receivingChainId,
  );
  const sendingAsset = TokenListManager.findTokenById(
    Utils.getAddress(txData.sendingAssetTokenAddr),
    sendingChain,
  );
  const receivingAsset = TokenListManager.findTokenById(
    Utils.getAddress(txData.receivingAssetTokenAddr),
    receivingChain,
  );

  const input = txData.sending.amount
    ? numeral(
        Utils.formatUnits(txData.sending.amount, sendingAsset.decimals),
      ).format('0.0000a')
    : '--';

  let icon;
  let lang;
  let clazz;

  const isActionNeeded = actionNeededList.includes(txData.status);

  if (isActionNeeded) {
    icon = <ion-icon name="information-circle" />;
    lang = <div>ACTION NEEDED</div>;
    clazz = 'action';
  } else {
    icon = <button className="button is-white is-loading">&nbsp;</button>;
    lang = 'PENDING';
    clazz = 'pending';
  }

  return (
    <div className={classnames('level is-mobile tx-history tx-item', clazz)}>
      <div className="level-item tx-icon">
        <div className="icon">{icon}</div>
      </div>
      <div className="level-item tx-content">
        <div>
          <div>
            {lang} {input} {sendingAsset.symbol} to {receivingAsset.symbol}
          </div>
          <div>
            {sendingChain.name} > {receivingChain.name}
          </div>
          <div className="tx-meta">
            {dayjs(txData.preparedTimestamp * 1000).fromNow()}
            <span className="bridge-selected">
              &nbsp;@&nbsp;
              {txData.bridge === 'cbridge'
                ? 'Celer Bridge'
                : `${txData.bridge} bridge`}
            </span>
          </div>
        </div>
      </div>
      {isActionNeeded && (
        <div className="level-item tx-action">
          <button
            className="button is-warning is-small"
            onClick={handleFinishAction(txData.transactionId)}
          >
            {txData.status === 'ReceiverTransactionPrepared'
              ? 'Finish'
              : 'Refund'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TxCrossChainActiveStatusView;
