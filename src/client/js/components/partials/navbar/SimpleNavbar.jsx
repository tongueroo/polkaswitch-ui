import React, { Component } from 'react';

export default class SimpleNavbar extends Component {
  render() {
    return (
      <nav id="nav" className="level is-mobile">
        <div className="level-left is-flex-grow-1">
          <div className="level-item is-narrow">
            <span className="logo-icon icon is-left is-hidden-mobile">
              <img src="/images/swing_beta_logo.svg" />
            </span>
            <span className="logo-icon icon is-left is-hidden-tablet">
              <img src="/images/swing_beta_logo.svg" />
            </span>
          </div>
          <div className="level-item is-flex-grow-3 is-justify-content-left is-hidden-touch">
            {/* <TokenSearchBar width={"75%"} /> */}
          </div>
        </div>
      </nav>
    );
  }
}
