import React from 'react';

export default function TokenClaimDisconnectedWallet(props) {
  return (
    <div className="columns is-centered">
      <div className='column token-claim-column'>
        <div className="page page-view-order">
          <div className="page-inner">
            <div className="card token-claim-card">
              <div className="column data-na-container">
                <img src="/images/logo_token_claim.svg" alt="Connect Wallet" />
                <p className='token-clam-title'>Swing Token Claim</p>
                <p className='token-clam-description'>
                  Swing Token's can now be claimed by connecting your wallet.
                </p>

                <button onClick={props.onClick} className="button is-success connect-wallet-btn">
                  Connect Wallet to claim tokens
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
