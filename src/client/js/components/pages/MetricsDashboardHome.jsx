import React, { useState, useEffect, useContext } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import SimpleNavbar from '../partials/navbar/SimpleNavbar';
import MetricsLineChart from '../partials/metrics/MetricsLineChart';
import numeral from 'numeral';

const METRICS_ENDPOINT = "https://swap.prod.swing.xyz/v0/metrics/stats";

const MetricsDashboardHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const delay = ms => new Promise(r => setTimeout(r, ms));

  const fetchData = async () => {
    try {
      const response = await fetch(METRICS_ENDPOINT);

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setData(data);
          setIsLoading(false);
        }
      }
    } catch (err) {
      setHasError(true);
      console.error('Failed to fetch Metrics data', err);
    }
  };

  const renderBasicMetricCard = (title, value, extra) => {
    return (
      <div className="box metrics-card">
        <div className="metrics-card-title">
          {title}
        </div>
        <div className="metrics-card-value">
          {!isLoading && (<div>{value}</div>)}
          {isLoading && (<div className="animated-loading-text"></div>)}
        </div>
        {!isLoading && extra}
      </div>
    );
  };

  const renderTopBridgeCard = (title, value, icon) => {
    return (
      <div className="metrics-bridge-card">
        <div className="bridge-title">
          {!isLoading && (<div>{title}</div>)}
          {isLoading && (<div className="animated-loading-text"></div>)}
        </div>
        <div className="bridge-vol">
          {!isLoading && (<div>24 HR VOLUME</div>)}
          {isLoading && (<div className="animated-loading-text"></div>)}
        </div>
        <div className="bridge-value">
          {!isLoading && (<div>{value}</div>)}
          {isLoading && (<div className="animated-loading-text"></div>)}
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
                {!isLoading && (<div>{numeral(data.totalBridgeLiquidity).format('$0,0')}</div>)}
                {isLoading && (<div className="animated-loading-text"></div>)}
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
                  {renderTopBridgeCard(
                    data.topBridges && data.topBridges[0]?.name,
                    data.topBridges && numeral(data.topBridges[0]?.volume).format('$0,0')
                  )}
                </div>
                <div className="column">
                  {renderTopBridgeCard(
                    data.topBridges && data.topBridges[1]?.name,
                    data.topBridges && numeral(data.topBridges[1]?.volume).format('$0,0')
                  )}
                </div>
                <div className="column">
                  {renderTopBridgeCard(
                    data.topBridges && data.topBridges[2]?.name,
                    data.topBridges && numeral(data.topBridges[2]?.volume).format('$0,0')
                  )}
                </div>
                <div className="column">
                  {renderTopBridgeCard(
                    data.topBridges && data.topBridges[3]?.name,
                    data.topBridges && numeral(data.topBridges[3]?.volume).format('$0,0')
                  )}
                </div>
                <div className="column is-2 next-arrow is-hidden">
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
                {renderBasicMetricCard(
                  "24 Hour Volume",
                  numeral(data.volume24Hrs).format('$0,0')
                )}
              </div>
              <div className="column">
                {renderBasicMetricCard(
                  "7 Day Volume",
                  numeral(data.volume7Days).format('$0,0')
                )}
              </div>
              <div className="column">
                {renderBasicMetricCard(
                  "All Time Volume",
                  numeral(data.volumeAllTime).format('$0,0')
                )}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                {renderBasicMetricCard(
                  "Unique Addresses (Users)",
                  numeral(data.activeUsers30Days).format('0,0')
                )}
              </div>
              <div className="column">
                {renderBasicMetricCard(
                  "Past 24 Hours Transactions",
                  numeral(data.transactions24Hrs).format('0,0')
                )}
              </div>
              <div className="column">
                {renderBasicMetricCard(
                  "Total Transactions",
                  numeral(data.transactionsAllTime).format('0,0')
                )}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                {renderBasicMetricCard(
                  "Monthly Volume",
                  numeral(data.volume30Days).format('$0,0'),
                  (<MetricsLineChart data={data.historical30DayVolume} />))
                }
              </div>
            </div>
            <div className="columns">
              <div className="column">
                {renderBasicMetricCard(
                  "Monthly Transaction Count",
                  numeral(data.transactions30Days).format('0,0'),
                  (<MetricsLineChart data={data.historical30DayActiveUsers} />))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <SimpleNavbar />

      {renderDashboard()}
    </div>
  );
};

export default MetricsDashboardHome;
