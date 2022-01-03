import React from 'react';
import AssetTableRow from './AssetTableRow';
import classnames from 'classnames';

export default function AssetsTable({ tokenData, loading }) {
  return (
    <div className="wallets-page-tokens-table">
      <div className="columns wallets-page-tokens-table__header is-mobile">
        <div className="column is-half-mobile">
          <span>Token</span>
        </div>
        <div className="is-hidden column is-hidden-mobile">
          <span>Price</span>
        </div>
        <div className="column is-half-mobile">
          <span>Balance</span>
        </div>
        <div className="is-hidden column is-hidden-mobile">
          <span>Value</span>
        </div>
      </div>

      {tokenData.map((t, i) => {
        return <AssetTableRow key={i} data={t}></AssetTableRow>;
      })}

      <div
        className={classnames('wallets-page-loader', { 'is-hidden': !loading })}
      >
        <div className="loader-text">Loading balances</div>
        <div className="loader is-loading"></div>
      </div>
    </div>
  );
}
