import React from 'react';
import Chart from 'react-apexcharts';

const PieChart = ({ series, width, height }) => {
  const data = series; // Contoh data: 45% laki-laki, 55% perempuan
  const options = {
    chart: {
      type: 'pie',
    },
    labels: ['Laki-laki', 'Perempuan'],
    legend: {
      position: 'bottom'
    },
    colors: ['#1E90FF', '#FF69B4'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <div>
      <Chart options={options} series={data} type="pie" width={width} height={height} />
    </div>
  );
};

export default PieChart;
