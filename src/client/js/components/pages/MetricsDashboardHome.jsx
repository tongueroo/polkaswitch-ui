import React, { useState, useEffect, useContext } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import Navbar from '../partials/navbar/Navbar';

const MetricsDashboardHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const renderDashboard = () => {
      return (
        <div className="columns is-centered">
          <div className="column token-claim-column">
            <div className="page page-view-order">
              <div className="page-inner">

                <div className="card metrics-container">
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
