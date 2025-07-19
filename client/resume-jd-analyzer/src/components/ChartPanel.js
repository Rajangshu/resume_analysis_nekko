// src/components/ChartPanel.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const ChartPanel = () => {
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/hr/responses")
      .then(res => {
        const responses = res.data;
        const locationCounts = {};

        responses.forEach(entry => {
          const location = entry.preferredLocation || "Unknown";
          locationCounts[location] = (locationCounts[location] || 0) + 1;
        });

        const labels = Object.keys(locationCounts);
        const values = Object.values(locationCounts);

        setData({
          labels,
          datasets: [{
            label: "Preferred Locations",
            data: values,
            backgroundColor: [
              "#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#14B8A6", "#8B5CF6"
            ],
            borderColor: "#fff",
            borderWidth: 2
          }]
        });

        setOptions({
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                font: {
                  size: 14
                }
              }
            }
          }
        });
      })
      .catch(err => {
        console.error("Chart data fetch failed:", err);
        setData(null);
      });
  }, []);

  return (
    <div style={{
      background: "#ffffff",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
      marginBottom: "2rem"
    }}>
      <h2 style={{ marginBottom: "1rem", fontWeight: 600 }}>📍 Preferred Job Locations</h2>
      {data && data.labels && data.labels.length > 0 ? (
        <div style={{ width: "400px", height: "400px", margin: "auto" }}>
          <Pie data={data} options={options} />
        </div>
      ) : (
        <p style={{ color: "#6b7280" }}>No data available</p>
      )}
    </div>
  );
};

export default ChartPanel;
