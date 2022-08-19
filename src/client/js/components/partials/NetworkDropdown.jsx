import React, { Component } from 'react';
import _ from 'underscore';
import classnames from 'classnames';
import TokenListManager from '../../utils/tokenList';
import TokenIconImg from './TokenIconImg';
import DropdownSelectModal from './DropdownSelectModal';

export default class NetworkDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.NETWORKS = window.NETWORK_CONFIGS;
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  handleDropdownClick(network) {
    return function handleClick(e) {
      this.handleClose();
      this.props.handleDropdownClick(network);
    }.bind(this);
  }

  render() {
    var selected =
      this.props.selected || TokenListManager.getCurrentNetworkConfig();

    var filteredNetworks = _.extend({}, this.NETWORKS);

    if (this.props.crossChain) {
      filteredNetworks = _.filter(filteredNetworks, (v) => {
        return v.crossChainSupported;
      });
    } else {
      filteredNetworks = _.filter(filteredNetworks, (v) => {
        return v.singleChainSupported;
      });
    }

    var networkList = _.map(
      filteredNetworks,
      function (v, i) {
        return (
          <a
            href="#"
            key={i}
            onClick={v.enabled && this.handleDropdownClick(v)}
            className={classnames('dropdown-item level is-mobile option', {
              disabled: !v.enabled,
            })}
          >
            <span className="level-left my-2">
              <span className="level-item">
                <TokenIconImg size={30} imgSrc={v.logoURI} />
              </span>
              <span className="level-item">
                {v.name} {!v.enabled && '(Coming Soon)'}
              </span>
            </span>
          </a>
        );
      }.bind(this),
    );

    return (
      <div
        className={classnames(
          'network-dropdown dropdown is-left is-active',
          {
            compact: this.props.compact,
          },
          this.props.className,
        )}
      >
        <div className="dropdown-trigger">
          <button
            onClick={this.handleOpen}
            className="button is-info is-light"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span className="level">
              <span className="level-left is-flex">
                <span className="level-item">
                  <TokenIconImg size={30} imgSrc={selected?.logoURI} />
                </span>
                <div className="network-wrapper item-level">
                  <div className="platform">{selected?.name}</div>
                  <div className="name">Blockchain</div>
                </div>
              </span>
            </span>
            <span className="icon is-small">
              <ion-icon name="chevron-down"></ion-icon>
            </span>
          </button>
        </div>
        <DropdownSelectModal
          open={this.state.open}
          title={'Choose Network'}
          handleClose={this.handleClose}
        >
          <>{networkList}</>
        </DropdownSelectModal>
      </div>
    );
  }
}
