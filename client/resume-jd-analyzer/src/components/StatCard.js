// src/components/StatCard.js
import React from "react";

const StatCard = ({ title, count, icon }) => (
  <div style={{
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.06)",
    flex: "1",
    minWidth: "220px",
    transition: "transform 0.2s ease",
    cursor: "default"
  }}>
    <div style={{ fontSize: "2.3rem", marginBottom: "0.8rem" }}>{icon}</div>
    <h4 style={{ margin: "0", fontSize: "1.05rem", color: "#475569" }}>{title}</h4>
    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e3a8a", marginTop: "0.4rem" }}>{count}</p>
  </div>
);

export default StatCard;
