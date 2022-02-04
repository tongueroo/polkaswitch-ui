/* eslint-disable implicit-arrow-linebreak */

const buildTxGenericStatus = (status) => {
  // building generic tx status msg to our react component
  // cBridge status ref: https://cbridge-docs.celer.network/developer/api-reference/gateway-gettransferstatus#transferhistorystatus-enum

  switch (status) {
    case 4:
      return 'PENDING';
    case 5:
      return 'FULFILLED';
    case 10:
      return 'REFUNDED';
    case 2:
      return 'CANCELLED';
    default:
      return status;
  }
};

// Implement DRY to make these arrays reusable for active Tx's and History Tx's
const mappingToGenerateConnextArray = ({ array }) =>
  array.map((tx) => ({
    receivingAssetTokenAddr: tx.crosschainTx.invariant.receivingAssetId,
    sendingAssetTokenAddr: tx.crosschainTx.invariant.sendingAssetId,
    receivingChainId: tx.crosschainTx.invariant.receivingChainId,
    sendingChainId: tx.crosschainTx.invariant.sendingChainId,
    receiving: {
      amount: tx.crosschainTx?.receiving?.amount,
    },
    transactionId: tx.crosschainTx.invariant.transactionId,
    fulfilledTxHash: tx?.fulfilledTxHash,
    preparedTimestamp: tx.preparedTimestamp,
    sending: {
      amount: tx.crosschainTx.sending.amount,
    },
    bridge: 'connext',
    status: tx.status,
    src_api_resp: tx,
  }));

const mappingToGenerateArrayAnyBridge = ({ array, bridge }) =>
  array.map((tx) => {
    const hash = tx.dst_block_tx_link.split('tx/');
    const timeStampInSeconds = Math.round(parseInt(tx.ts, 10) / 1000);

    return {
      receivingAssetTokenAddr: tx.dst_received_info.token.address,
      receivingChainId: tx.dst_received_info.chain.id,
      sendingAssetTokenAddr: tx.src_send_info.token.address,
      sendingChainId: tx.src_send_info.chain.id,
      fulfilledTxHash: hash[1],
      transactionId: tx?.transfer_id,
      preparedTimestamp: timeStampInSeconds.toString(),
      receiving: {
        amount: tx.dst_received_info.amount,
      },
      sending: {
        amount: tx.src_send_info.amount,
      },
      bridge,
      status: buildTxGenericStatus(tx.status),
      src_api_resp: tx,
    };
  });

export { mappingToGenerateConnextArray, mappingToGenerateArrayAnyBridge };
