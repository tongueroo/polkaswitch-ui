import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';

const ErrorModal = (props) => {

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
              <div className="success-modal-body">
                <img src="/images/failture_icon.svg" alt="Something went wrong" />
                <p className="success-text">Something went wrong</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
  
}

export default ErrorModal;