import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import axios from "axios";

ChartJS.register(
  LineElement,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const timeRanges = [
  { label: "1D", value: 1 },
  { label: "3D", value: 3 },
  { label: "1W", value: 7 },
  { label: "1M", value: 30 },
  { label: "6M", value: 182 },
  { label: "1Y", value: 365 },
  { label: "max", value: "max" },
];

const ChartComponent = ({ selectedRange, onRangeChange }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Bitcoin Price",
        data: [],
        borderColor: "#4f46e5",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(79, 70, 229, 0.5)");
          gradient.addColorStop(1, "rgba(79, 70, 229, 0)");

          return gradient;
        },
        fill: true,
        pointRadius: 0,
      },
      {
        label: "Volume",
        type: "bar",
        data: [],
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        yAxisID: "y1",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const url =
        selectedRange === "max"
          ? "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=max"
          : `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${selectedRange}`;

      try {
        const response = await axios.get(url);
        const prices = response.data.prices.map((price) => ({
          x: new Date(price[0]).toLocaleDateString(),
          y: price[1],
        }));
        const volumes = response.data.total_volumes.map((volume) => ({
          x: new Date(volume[0]).toLocaleDateString(),
          y: volume[1],
        }));

        setChartData({
          labels: prices.map((d) => d.x),
          datasets: [
            {
              label: "Bitcoin Price",
              data: prices.map((d) => d.y),
              borderColor: "#4f46e5",
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;

                if (!chartArea) {
                  return null;
                }
                const gradient = ctx.createLinearGradient(
                  0,
                  0,
                  0,
                  chartArea.bottom
                );
                gradient.addColorStop(0, "rgba(79, 70, 229, 0.5)");
                gradient.addColorStop(1, "rgba(79, 70, 229, 0)");

                return gradient;
              },
              fill: true,
              pointRadius: 0,
              yAxisID: "y",
            },
            {
              label: "Volume",
              type: "bar",
              data: volumes.map((d) => d.y),
              backgroundColor: "rgba(79, 70, 229, 0.2)",
              yAxisID: "y1",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [selectedRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#4f46e5",
        borderRadius: 4,
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        mode: "nearest",
        intersect: false,
      },
      annotation: {
        annotations: {
          midLineX: {
            type: "line",
            scaleID: "x",
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 2,
            borderDash: [8, 4],
            value: (ctx) => {
              const xMin = ctx.chart.scales.x.min;
              const xMax = ctx.chart.scales.x.max;
              return (xMax + xMin) / 2;
            },
          },
          midLineY: {
            type: "line",
            scaleID: "y",
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 2,
            borderDash: [8, 4],
            value: (ctx) => {
              const yMin = ctx.chart.scales.y.min;
              const yMax = ctx.chart.scales.y.max;
              return (yMax + yMin) / 2;
            },
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: false,
          color: "#e5e7eb",
          lineWidth: 2,
          borderDash: [2, 2],
        },
        ticks: {
          maxTicksLimit: 10,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        grid: {
          display: false,
          borderDash: [2, 2],
          lineWidth: 1,
          color: "#d1d5db",
        },
        ticks: {
          display: false,
        },
        beginAtZero: false,
      },
      y1: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        beginAtZero: false,
        position: "right",
        max: Math.max(...(chartData.datasets[1]?.data || [])) * 4,
      },
    },
  };

  return (
    <div style={{ width: "1040px", height: "500px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <button
          style={{
            background: "transparent",
            border: "none",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: "#4f46e5",
          }}
        >
          <span style={{ marginRight: "6px" }}>⛶</span> Fullscreen
        </button>
        <button
          style={{
            background: "transparent",
            border: "none",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: "#4f46e5",
          }}
        >
          <span style={{ marginRight: "6px" }}> &#10753;</span> Compare
        </button>
        {timeRanges.map((range) => (
          <button
            key={range.label}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor:
                selectedRange === range.value ? "#4f46e5" : "#f3f4f6",
              color: selectedRange === range.value ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => onRangeChange(range.value)}
          >
            {range.label}
          </button>
        ))}
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
