// 'https://api.dev.swing.xyz'
// nxtp swap https://crosschain-swap-api-web-swap.dev.swing.xyz/

// Temporary baseUrl until merge /transfer and /claim
const baseUrl = 'https://api.dev.swing.xyz';

const chainNameHandler = (chain) => (chain === 'BNB Chain' ? 'bsc' : chain.toLowerCase());

export { baseUrl, chainNameHandler };
