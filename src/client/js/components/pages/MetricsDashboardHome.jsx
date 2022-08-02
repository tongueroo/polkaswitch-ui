import React, { useState, useEffect, useContext } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import Navbar from '../partials/navbar/Navbar';
import MetricsLineChart from '../partials/metrics/MetricsLineChart';

const MetricsDashboardHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const renderBasicMetricCard = (title, value, extra) => {
    return (
      <div className="box metrics-card">
        <div className="metrics-card-title">
          {title}
        </div>
        <div className="metrics-card-value">
          {value}
        </div>
        {extra}
      </div>
    );
  };

  const renderTopBridgeCard = (title, value, icon) => {
    return (
      <div className="metrics-bridge-card">
        <div className="bridge-title">
          {title}
        </div>
        <div className="bridge-vol">
          24 HR VOLUME
        </div>
        <div className="bridge-value">
          {value}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="container is-max-desktop">
        <div className="columns is-centered metrics-container">
          <div className="column is-one-quarter">
            <div className="metrics-sub-title">
              Liquidity
            </div>
            <div className="box metrics-card">
              <div className="metrics-card-title">
                Swing Bridge Liquidity
              </div>
              <div className="metrics-card-value small">
                $4,222,231,293
              </div>
            </div>
          </div>
          <div className="column">
            <div className="metrics-sub-title">
              Top Bridges
            </div>
            <div className="box metrics-bridge-row">
              <div className="columns is-gapless">
                <div className="column">
                  {renderTopBridgeCard("Hop", "$3,457,349")}
                </div>
                <div className="column">
                  {renderTopBridgeCard("Celer", "$3,457,349")}
                </div>
                <div className="column">
                  {renderTopBridgeCard("connext", "$3,457,349")}
                </div>
                <div className="column">
                  {renderTopBridgeCard("MultiChain", "$3,457,349")}
                </div>
                <div className="column is-2 next-arrow">
                  <span className="icon">
                    <ion-icon name="arrow-forward-circle"></ion-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns is-centered metrics-container">
          <div className="column">
            <div className="metrics-sub-title">
              Swing Metrics
            </div>
            <div className="columns">
              <div className="column">
                {renderBasicMetricCard("24 Hour Volume", "$11,231,293")}
              </div>
              <div className="column">
                {renderBasicMetricCard("7 Day Volume", "$33,231,293")}
              </div>
              <div className="column">
                {renderBasicMetricCard("All Time Volume", "$422,231,293")}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                {renderBasicMetricCard("Unique Addresses (Users)", "105,232")}
              </div>
              <div className="column">
                {renderBasicMetricCard("Past 24 Hours Transactions", "5,203")}
              </div>
              <div className="column">
                {renderBasicMetricCard("Total Transactions", "129,984")}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                {renderBasicMetricCard("Monthly Volume", "$21,203,283")}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                {renderBasicMetricCard("Monthly Active Users", "103,232")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Navbar />

      {renderDashboard()}
    </div>
  );
};

export default MetricsDashboardHome;
