import React, { Component, PureComponent } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
  },
  {
    name: 'Page B',
    uv: 3000,
  },
  {
    name: 'Page C',
    uv: 2000,
  },
  {
    name: 'Page D',
    uv: 2780,
  },
  {
    name: 'Page E',
    uv: 1890,
  },
  {
    name: 'Page F',
    uv: 2390,
  },
  {
    name: 'Page G',
    uv: 3490,
  },
];

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
        <text x={0} y={0} dy={16} font-size="14px" textAnchor="end" fill="#666">
          {payload.value}
        </text>
      </g>
    );
  }
}

export default class MetricsLineChart extends Component {
  render() {
    return (
      <div className="metrics-line-chart">
        <ResponsiveContainer width="100%" height={280} debounce={1}>
          <LineChart
            width={500}
            height={280}
            data={data}
          >
            <XAxis
              dataKey="name"
              height={40}
              stroke={"#ccc"}
              tickLine={false}
              tick={<CustomizedAxisTick />} />
            <Tooltip />
            <Line type="monotone" dataKey="uv" stroke="#22BA79" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
