import React from 'react';
import styled from 'styled-components';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// tempstyle
const Wrapper = styled.div`
  width: 90%;
  height: 20rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const AreaChartTemplate = props => {
  const unit = props.data[0].substance;
  return (
    <Wrapper className="chart-template">
      <ResponsiveContainer width={'99%'} height={'99%'}>
        <AreaChart
          data={props.data}
          margin={{ top: 0, right: 0, bottom: 0, left: 20 }}
        >
          <CartesianGrid />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="hotpink"
            strokeWidth={2}
          />
          <XAxis dataKey="year" strokeWidth={2} />
          <YAxis
            tickMargin={10}
            strokeWidth={2}
            domain={['auto', 'auto']}
            dataKey="value"
          />

          {/* <Tooltip content={<CustomTooltip unit={props.unit} />} /> */}
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

const ChartTemplate = props => {
  if (!props.data) return '';

  const data = props.data;

  if (data.length === 1) {
    data.push(data[0]);
  }

  //const unit = props.chart.substances[0].code;

  return <AreaChartTemplate data={data} unit="hej" />;
};

export default ChartTemplate;
