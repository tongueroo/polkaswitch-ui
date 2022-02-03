import React, { Component } from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import EventManager from '../../../utils/events';
import Nxtp from '../../utils/nxtp';

import TxStatusView from './TxStatusView';

// POSSIBLY NON USED COMPONENT/DEPRECATED COMP

export default class ConnextTxTrackerView extends Component {
  constructor(props) {
    super(props);
    this.state = { refresh: Date.now(), open: false };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    this.subUpdate = EventManager.listenFor(
      'connextTxQueueUpdated',
      this.handleUpdate,
    );
  }

  componentWillUnmount() {
    this.subUpdate.unsubscribe();
  }

  handleUpdate() {
    this.setState({ refresh: Date.now() });
  }

  render() {
    const queue = Nxtp.getQueue();

    return (
      <div>
        {_.keys(queue).length < 1 && (
          <div className="empty-state">
            <div>
              <div className="empty-text has-text-info">
                No recent transactions
              </div>
              <div className="icon has-text-info-light">
                <ion-icon name="file-tray-outline" />
              </div>
            </div>
          </div>
        )}

        {_.map(queue, (item, i) => (
          <TxStatusView key={i} data={item} />
        ))}
      </div>
    );
  }
}
