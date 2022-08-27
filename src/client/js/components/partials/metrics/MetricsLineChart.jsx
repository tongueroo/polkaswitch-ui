import React, { Component, PureComponent } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

class CustomizedLabel extends PureComponent {
  render() {
    const { x, y, stroke, value } = this.props;

    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
  }
}

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} fontSize="14px" textAnchor="end" fill="#666">
          {payload.value}
        </text>
      </g>
    );
  }
}

export default function MetricsLineChart(props) {
  return (
    <div className="metrics-line-chart">
      <ResponsiveContainer width="100%" height={280} debounce={1}>
        <LineChart
          width={500}
          height={280}
          data={props.data.map((v) => {
            return { date: v.date, value: +v.value };
          })}
        >
          <XAxis
            dataKey="date"
            height={40}
            stroke={"#ccc"}
            tickLine={false}
            tick={<CustomizedAxisTick />} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#22BA79" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
