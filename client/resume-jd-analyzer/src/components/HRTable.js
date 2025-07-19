// src/components/HRTable.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const HRTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/hr/responses")
      .then(res => setRows(res.data))
      .catch(err => {
        console.error("Table fetch failed:", err);
        setRows([]);
      });
  }, []);

  return (
    <div style={{
      background: "#ffffff",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
      marginTop: "2rem"
    }}>
      <h2 style={{ marginBottom: "1rem", fontWeight: 600 }}>📑 Recent HR Questionnaire Responses</h2>
      {rows.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No responses available.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={thStyle}>Candidate ID</th>
                <th style={thStyle}>Relocate</th>
                <th style={thStyle}>Work Hours</th>
                <th style={thStyle}>Expected Salary</th>
                <th style={thStyle}>Preferred Location</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={tdStyle}>{row.cvId || "N/A"}</td>
                  <td style={tdStyle}>{row.relocate || "-"}</td>
                  <td style={tdStyle}>{row.workHours || "-"}</td>
                  <td style={tdStyle}>{row.salaryExpectation || "-"}</td>
                  <td style={tdStyle}>{row.preferredLocation || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: "600",
  color: "#374151",
  borderBottom: "2px solid #e5e7eb"
};

const tdStyle = {
  padding: "12px 16px",
  color: "#374151"
};

export default HRTable;
