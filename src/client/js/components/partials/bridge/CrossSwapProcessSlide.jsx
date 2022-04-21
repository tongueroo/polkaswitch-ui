import React, { Component } from 'react';
import classnames from 'classnames';
import * as ethers from 'ethers';
import BN from 'bignumber.js';
import { NxtpSdkEvents } from '@connext/nxtp-sdk';
import TokenIconBalanceGroupView from '../TokenIconBalanceGroupView';
import TokenIconImg from '../TokenIconImg';
import Wallet from '../../../utils/wallet';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';
import TxBridgeManager from '../../../utils/txBridgeManager';
import Nxtp from '../../../utils/nxtp';
import { STATUS_NAME } from '../../../utils/requests/utils';

export default class CrossSwapProcessSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      finishable: false,
      complete: false,
    };

    this.handleTransfer = this.handleTransfer.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.buttonText = this.buttonText.bind(this);
    this.onClickfn = this.onClickfn.bind(this);
  }

  async componentDidMount() {
    this.subNxtpUpdated = EventManager.listenFor('nxtpEventUpdated', this.handleNxtpEvent.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.crossChainTransactionId !== this.props.crossChainTransactionId) {
      this.setState({
        loading: false,
        finishable: false,
        complete: false,
      });
    }
  }

  componentWillUnmount() {
    this.subNxtpUpdated.unsubscribe();
  }

  completeProcess(hash) {
    this.setState({
      complete: true,
    });
    this.props.handleTransactionComplete(true, hash);
  }

  handleBack(e) {
    if (!this.state.loading) {
      this.props.handleBackOnConfirm();
    }
  }

  //future deprecated
  // async handleCbridgeEvent(transferId) {
  //   if (this.state.complete) {
  //     return;
  //   }

  //   TxBridgeManager.transferStepTwo(this.props.crossChainTransactionId, transferId).then((resp) => {
  //     console.log('cBridge getTransferStatus polling', resp);

  //     const { data } = resp;

  //     if (data.src_block_tx_link) {
  //       this.setState({
  //         finishable: true,
  //       });
  //     }

  //     if (data.dst_block_tx_link) {
  //       const dstChainTxHash = data.dst_block_tx_link.split('tx/');

  //       this.completeProcess(dstChainTxHash[1]);

  //       this.stopPollingCbridge();
  //     }

  //     if (data.status === 6 || data.status === 2) {
  //       this.stopPollingCbridge();

  //       this.props.handleTransactionComplete(false, undefined);

  //       this.setState({
  //         loading: false,
  //       });
  //     }
  //   });
  // }

  async handlePollingEvent(data, bridge) {
    const getStatusTransfer = await TxBridgeManager.getTransferStatus({
      id: data,
      userAddress: Wallet.currentAddress(),
      toChain: this.props.toChain.name,
      fromChain: this.props.fromChain.name,
      to: this.props.to,
      fromAmount: this.props.fromAmount,
      from: this.props.from,
      bridge,
    });

    console.log('handlePollingEvent', getStatusTransfer);

    // setup for nxtp
    if (STATUS_NAME.pendingDestination === getStatusTransfer?.status.toLowerCase() && getStatusTransfer.needClaim) {
      this.setState(
        {
          finishable: true,
          loading: false,
        },
        () => this.stopPollingStatus(),
      );
    }

    if (!getStatusTransfer.needClaim) {
      if (STATUS_NAME.pendingDestination === getStatusTransfer?.status.toLowerCase()) {
        this.setState({
          finishable: true,
        });
      }
      if (STATUS_NAME.completed === getStatusTransfer?.status.toLowerCase()) {
        // missing hash to
        this.completeProcess('data.transactionHash');
      }
    }

    //call stopPollingStatus
  }

  async stopPollingStatus() {
    window.clearInterval(this.statusPolling);
  }

  handleNxtpEvent(status) {
    if (this.state.complete) {
      return;
    }

    if (status !== NxtpSdkEvents.ReceiverTransactionPrepared && status !== NxtpSdkEvents.ReceiverTransactionFulfilled) {
      return;
    }

    if (this.state.finishable && Nxtp.isActiveTxFinished(this.props.crossChainTransactionId)) {
      this.completeProcess(Nxtp.getHistoricalTx(this.props.crossChainTransactionId).fulfilledTxHash);
    } else if (!this.state.finishable && Nxtp.isActiveTxFinishable(this.props.crossChainTransactionId)) {
      this.setState({
        loading: false,
        finishable: true,
      });
    }
  }

  async handleTransfer() {
    const selectedTx = TxBridgeManager.getTx(this.props.crossChainTransactionId);
    const route = selectedTx?.bridge?.route[0];
    const bridge = selectedTx?.bridge?.route[0].bridge || 'celer';

    let txResp;

    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const { tx, txHash } = await TxBridgeManager.sendTransfer({
            fromChain: this.props.fromChain.name,
            from: this.props.from,
            toChain: this.props.toChain.name,
            to: this.props.to,
            fromAmount: this.props.fromAmount,
            fromAddress: Wallet.currentAddress(),
            route,
          });
          txResp = tx;
        } catch (e) {
          this.props.handleTransactionComplete(false, undefined);
          this.setState({
            loading: false,
          });
        }

        const { data, txId } = txResp;

        const txIdToStatus = txId ? txId : data;

        console.log('UPDATED RESULT!', { data, txId, txIdToStatus });

        this.statusPolling = window.setInterval(() => this.handlePollingEvent(txIdToStatus, bridge), 10000);

        // TxBridgeManager.transferStepOne(this.props.crossChainTransactionId)
        //   .then((data) => {
        //     Metrics.track('bridge-started', {
        //       toChain: this.props.toChain,
        //       fromChain: this.props.fromChain,
        //       from: this.props.from,
        //       to: this.props.to,
        //       fromAmont: this.props.fromAmount,
        //     });
        //     if (TxBridgeManager.twoStepTransferRequired(this.props.crossChainTransactionId)) {
        //       if (data.cbridge) {
        //         this.cbridgePolling = window.setInterval(() => this.handleCbridgeEvent(data.transferId), 60000);
        //       }
        //       // do nothing.
        //       // Waiting for events to indicate ready for Step2
        //     } else {
        //       this.completeProcess(data.transactionHash);
        //     }
        //   })
        //   .catch((e) => {
        //     console.error('#### swap failed from catch ####', e);
        //     this.props.handleTransactionComplete(false, undefined);
        //     this.setState({
        //       loading: false,
        //     });
        //   });
      },
    );
  }

  handleFinish() {
    this.setState(
      {
        loading: true,
      },
      () => {
        TxBridgeManager.transferStepTwo(this.props.crossChainTransactionId)
          .then(() => {
            Metrics.track('bridge-complete', {
              toChain: this.props.toChain,
              fromChain: this.props.fromChain,
              from: this.props.from,
              to: this.props.to,
              fromAmont: this.props.fromAmount,
            });

            this.setState({
              loading: false,
            });
          })
          .catch((e) => {
            console.error('#### swap failed from catch ####', e);

            this.props.handleTransactionComplete(false, undefined);

            this.setState({
              loading: false,
            });
          })
          .finally(() => this.props.handleFinishedResult(true));
      },
    );
  }

  hasSufficientBalance() {
    if (this.props.availableBalance) {
      const balBN = BN(this.props.availableBalance);
      const fromBN = BN(this.props.fromAmount);
      return fromBN.lte(balBN);
    }
    return false;
  }

  allowSwap() {
    return !this.state.loading && this.hasSufficientBalance();
  }

  renderReview() {
    return (
      <div>
        <div className="text-gray-stylized">
          <span>You Pay</span>
        </div>

        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item chain-icon">
              <TokenIconImg size="35" imgSrc={this.props.fromChain.logoURI} />
            </div>
            <TokenIconBalanceGroupView
              network={this.props.fromChain}
              token={this.props.from}
              refresh={this.props.refresh}
            />
          </div>

          <div className="level-right">
            <div className="level-item">
              <div>
                <div className="currency-text">{this.props?.fromAmount}</div>
                <div
                  className={classnames('fund-warning has-text-danger has-text-right', {
                    'is-hidden': this.hasSufficientBalance(),
                  })}
                >
                  <span className="icon">
                    <ion-icon name="warning-outline" />
                  </span>
                  <span>Insufficient funds</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="text-gray-stylized">
          <span>You Receive</span>
        </div>

        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item chain-icon">
              <TokenIconImg size="35" imgSrc={this.props.toChain.logoURI} />
            </div>
            <TokenIconBalanceGroupView
              network={this.props.toChain}
              token={this.props.to}
              refresh={this.props.refresh}
            />
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className="currency-text">{this.props?.toAmount}</div>
            </div>
          </div>
        </div>

        <hr />
      </div>
    );
  }

  renderLoading() {
    return (
      <div className={classnames('centered-view')}>
        <div className="icon">
          <ion-icon name="hourglass-outline" />
        </div>
        <div className="title">{this.state.finishable ? 'Finalizing Transfer' : 'Starting Transfer'}</div>
        <div className="details">
          <div>
            {this.state.finishable
              ? 'We are depositing funds into the receiving chain.'
              : 'We are moving funds from the sending chain.'}
            <br />
            This step normally takes 2-3 minutes.
            <br />
            Please do not refresh browser.
          </div>
        </div>
      </div>
    );
  }

  async approveToken() {
    const selectedTx = TxBridgeManager.getTx(this.props.crossChainTransactionId);
    const bridge = selectedTx?.bridge?.route[0].bridge || 'celer';

    const approvedToken = await TxBridgeManager.approveToken({
      fromAddress: Wallet.currentAddress(),
      fromChain: this.props.fromChain.name,
      from: this.props.from,
      toChain: this.props.toChain.name,
      to: this.props.to,
      bridge,
      fromAmount: this.props.fromAmount,
    });

    if (approvedToken) {
      this.props.handleFinishedAllowance();
    }

    console.log('approvedtoken', approvedToken);
  }

  buttonText() {
    switch (true) {
      case this.props.isAllowanceToken:
        return 'Approve Token';
      case this.state.finishable:
        return 'Finish Transfer';
      case !this.state.finishable:
        return 'Start Transfer';
      default:
        return 'Approve Token';
    }
  }

  async onClickfn() {
    switch (true) {
      case this.props.isAllowanceToken:
        return await this.approveToken();
      case this.state.finishable:
        return this.handleFinish();
      case !this.state.finishable:
        return this.handleTransfer();
      default:
        return this.handleTransfer();
    }
  }

  render() {
    if (!this.props.toAmount || !this.props.fromAmount) {
      return <div />;
    }

    let bodyContent;

    if (this.state.loading) {
      bodyContent = this.renderLoading();
    } else {
      bodyContent = this.renderReview();
    }

    return (
      <div className="page page-stack page-view-cross-process">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <div className="level-item">
                  <span className="icon ion-icon clickable" onClick={this.handleBack}>
                    <ion-icon name="arrow-back-outline" />
                  </span>
                </div>
              </div>
              <div className="level-item">
                <b className="widget-title">Review &amp; Submit Transfer</b>
              </div>
            </div>
          </div>

          <hr />

          {bodyContent}

          <div>
            <button
              type="button"
              className={classnames('button is-primary is-fullwidth is-medium', {
                'is-loading': this.state.loading,
              })}
              disabled={!this.allowSwap()}
              onClick={() => this.onClickfn()}
            >
              {this.buttonText()}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
