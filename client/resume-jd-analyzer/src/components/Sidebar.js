// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { path: "/dashboard", label: "🏠 Dashboard" },
    { path: "/analyze", label: "📁 Upload & Analyze" },
    { path: "/chat", label: "💬 Chat with Resume" },
    { path: "/interview", label: "🧠 Interview Questions" },
    { path: "/hr-questionnaire", label: "📝 HR Questionnaire" },
  ];

  return (
    <div style={{
      width: "240px",
      background: "#1e3a8a",
      color: "#fff",
      minHeight: "100vh",
      padding: "2rem 1rem",
      boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column"
    }}>
      <h2 style={{
        fontSize: "1.8rem",
        marginBottom: "2rem",
        color: "#facc15",
        fontWeight: "bold",
        letterSpacing: "0.5px",
      }}>
        ⚙️ SkillMatch AI
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {links.map(({ path, label }) => {
          const isActive = pathname === path;
          return (
            <motion.div
              key={path}
              whileHover={{ scale: 1.05, backgroundColor: "#374151" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                borderRadius: "8px",
                overflow: "hidden"
              }}
            >
              <Link
                to={path}
                style={{
                  display: "block",
                  padding: "0.8rem 1rem",
                  textDecoration: "none",
                  color: isActive ? "#facc15" : "#e0e7ff",
                  fontWeight: isActive ? "600" : "500",
                  background: isActive ? "#374151" : "transparent",
                  borderLeft: isActive ? "4px solid #facc15" : "4px solid transparent"
                }}
              >
                {label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
