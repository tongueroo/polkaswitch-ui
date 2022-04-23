// 'https://api.dev.swing.xyz'
// nxtp swap https://crosschain-swap-api-web-swap.dev.swing.xyz/

// Temporary baseUrl until merge /transfer and /claim
const baseUrl = 'https://swap.prod.swing.xyz';

const chainNameHandler = (chain) => (chain === 'BNB Chain' ? 'bsc' : chain.toLowerCase());

const STATUS_NAME = {
  submitted: 'submitted',
  pendingSource: 'pending source chain',
  pendingDestination: 'pending destination chain',
  completed: 'completed',
  refundRequired: 'refund required',
  refunded: 'refunded',
  failedSourceChain: 'failed source chain',
  failedDestinationChain: 'failed destination chain',
};

export { baseUrl, chainNameHandler, STATUS_NAME };
