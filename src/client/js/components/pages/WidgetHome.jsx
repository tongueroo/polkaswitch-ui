import React, { Component } from 'react';
import Navbar from '../partials/navbar/Navbar';
import ConnectWalletModal from '../partials/ConnectWalletModal';
import TxHistoryModal from '../partials/TxHistoryModal';
import NotificationSystem from '../partials/NotificationSystem';
import MobileMenu from '../partials/navbar/MobileMenu';
import TxnHistory from '../partials/swap/TxnHistory';
import { Swap } from '@swing.xyz/ui';

export default class Widget extends Component {
  render() {
    return (
      <div className="container">
        <Navbar />
        <MobileMenu />
        <NotificationSystem />
        <ConnectWalletModal />
        <TxHistoryModal />
        <div>
          <Swap />
          <TxnHistory />
        </div>
      </div>
    );
  }
}
