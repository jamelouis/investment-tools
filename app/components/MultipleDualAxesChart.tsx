import React, { useEffect, useRef } from 'react';
import { DualAxes } from '@ant-design/plots';

const MultiLineDualAxesChart = () => {
  const chartRef = useRef(null);

  // Sample data for left Y-axis (4 lines)
  const dataLeft = [
    { year: '2019', value1: 35, value2: 20, value3: 40, value4: 30 },
    { year: '2020', value1: 40, value2: 25, value3: 45, value4: 35 },
    { year: '2021', value1: 50, value2: 30, value3: 55, value4: 40 },
    { year: '2022', value1: 45, value2: 35, value3: 50, value4: 45 },
    { year: '2023', value1: 60, value2: 40, value3: 65, value4: 50 },
  ];

  // Sample data for right Y-axis (2 lines)
  const dataRight = [
    { year: '2019', value5: 1000, value6: 800 },
    { year: 2020, value5: 1200, value6: 900 },
    { year: '2021', value5: 1500, value6: 1100 },
    { year: '2022', value5: 1300, value6: 1000 },
    { year: '2023', value5: 1800, value6: 1300 },
  ];

  const config = {
    data: [dataLeft, dataRight],
    xField: 'year',
    yField: [['value1', 'value2', 'value3', 'value4'], ['value5', 'value6']],
    geometryOptions: [
      {
        geometry: 'line',
        seriesField: 'key',
        lineStyle: {
          lineWidth: 2,
        },
        smooth: true,
      },
      {
        geometry: 'line',
        seriesField: 'key',
        lineStyle: {
          lineWidth: 2,
        },
        smooth: true,
        color: ['#5AD8A6', '#FF9800'],
      },
    ],
    meta: {
      value1: { alias: 'Value 1' },
      value2: { alias: 'Value 2' },
      value3: { alias: 'Value 3' },
      value4: { alias: 'Value 4' },
      value5: { alias: 'Value 5' },
      value6: { alias: 'Value 6' },
    },
    yAxis: {
      value1: {
        title: {
          text: 'Left Y-Axis',
        },
      },
      value5: {
        title: {
          text: 'Right Y-Axis',
        },
      },
    },
    legend: {
      itemName: {
        formatter: (text) => {
          const aliases = {
            value1: 'Value 1',
            value2: 'Value 2',
            value3: 'Value 3',
            value4: 'Value 4',
            value5: 'Value 5',
            value6: 'Value 6',
          };
          return aliases[text] || text;
        },
      },
    },
    tooltip: {
      shared: true,
      showMarkers: false,
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      try {
        const chart = new DualAxes(chartRef.current, config);
        chart.render();
        console.log('Chart rendered successfully');
      } catch (error) {
        console.error('Error rendering chart:', error);
      }
    }
  }, []);

  return (
    <div style={{ width: '100%', height: 400, border: '1px solid #ccc' }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      {!dataLeft.length || !dataRight.length ? (
        <div>No data available for the chart</div>
      ) : null}
    </div>
  );
};

export default MultiLineDualAxesChart;