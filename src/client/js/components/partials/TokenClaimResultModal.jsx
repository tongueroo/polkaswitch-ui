import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';

const TokenClaimResultModal = (props) => {

  return (
    <div className={classnames('modal success-modal', { 'is-active': props.open })}>
        <div
          onClick={props.handleClose}
          className="modal-background"
        ></div>
        <div className="modal-content">
          <div
            className="box modal-basic-style modal-dropdown-options"
          >
            <div className="modal-body">
              {props.success === 1
              && <div className="success-modal-body">
                  <img src="/images/success_icon.svg" alt="Success" />
                  <p className="success-text">Success</p>
                  <p>Your $SWING tokens have been <br /> successfully added to your wallet.</p>

                  <button onClick={props.handleClose} className="button is-success">
                    Done
                  </button>
                </div>}

              {props.success === 0 && <div className="success-modal-body">
                <img src="/images/failture_icon.svg" alt="Transaction is reverted" />
                <p className="success-text">Vesting: no tokens are due</p>
                <a className="token-claim-contact-us" href="https://discord.gg/jQ9Xhdbb" target="_blank">Contact us on Discord</a>
              </div>}

              {props.success === -1 && <div className="success-modal-body">
                  <img src="/images/failture_icon.svg" alt="Something went wrong" />
                  <p className="success-text">Something went wrong</p>
                  <p>Having issues claiming your Swing Tokens?</p>
                  <a className="token-claim-contact-us" href="https://discord.gg/jQ9Xhdbb" target="_blank">Contact us on Discord</a>
                </div>}
            </div>
          </div>
        </div>
      </div>
  );
  
}

export default TokenClaimResultModal;