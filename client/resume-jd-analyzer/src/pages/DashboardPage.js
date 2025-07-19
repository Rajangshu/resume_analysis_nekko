// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ChartPanel from "../components/ChartPanel";
import HRTable from "../components/HRTable";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalCVs: 0, totalJDs: 0, totalHRAnswers: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard")
      .then(res => {
        setStats(res.data);
      })
      .catch(err => console.error("Failed to load dashboard data:", err));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
      <Sidebar />

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ flex: 1, padding: "2rem", background: "#f8f9fc", overflowY: "auto" }}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{ marginBottom: "2rem" }}
        >
          📊 HR Analytics Dashboard
        </motion.h1>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}
        >
          <StatCard title="Resumes Uploaded" count={stats.totalCVs} icon="📄" />
          <StatCard title="Job Descriptions" count={stats.totalJDs} icon="📝" />
          <StatCard title="HR Responses" count={stats.totalHRAnswers} icon="📋" />
        </motion.div>

        {/* Real data visualizations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <ChartPanel />
          <HRTable />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
