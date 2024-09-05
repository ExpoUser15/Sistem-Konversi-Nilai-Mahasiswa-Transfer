import React, { useContext, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { ModeContext } from "../../context/ModeContext";

function ConversionChart({ categories, series, height }) {
  const { theme } = useContext(ModeContext);
  const modeRef = useRef();

  useEffect(()=> {
    modeRef.current = localStorage === 'dark' ? 'dark' : '';
  }, [theme]);

  const data = {
    categories: categories,
    series: series,
  };

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false, 
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 20,
        horizontal: false, 
      },
    },
    colors: ["#3B82F6"], 
    dataLabels: {
      enabled: true, 
      style: {
        colors: ["#fff"], 
      },
    },
    xaxis: {
      categories: data.categories,
    },
    grid: {
      borderColor: "#e7e7e7", 
    },
    fill: {
      opacity: 0.9,
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: modeRef.current === 'dark' ? '#fff' : '#000', // Warna font sumbu Y
        },
      },
    },
    tooltip: {
      theme: modeRef.current, 
      style: {
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
      },
      y: {
        formatter: function (val) {
          return `${val} Konversi`;
        },
      },
    },
  };

  const chartSeries = [
    {
      name: "Jumlah Konversi",
      data: data.series,
    },
  ];

  return (
    <div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={height}
      />
    </div>
  );
}

export default ConversionChart;
