import React, { useState } from "react";
import axios from "axios";

const AnalysisPanel = ({ jds, cvs }) => {
  const [selectedJD, setSelectedJD] = useState("");
  const [selectedCVs, setSelectedCVs] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedJD || selectedCVs.length === 0) {
      alert("Please select a JD and at least one resume.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/v1/analysis", {
        jdId: selectedJD,
        cvIds: selectedCVs,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Analysis failed: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedCVs(selected);
  };

  return (
    <div
      style={{
        padding: "2.5rem 4vw",
        width: "62%",
        background: "linear-gradient(to bottom right, #f9fafb, #eef2f7)",
        minHeight: "100vh",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <h2 style={{ color: "#1e293b", fontWeight: "600", marginBottom: "2rem" }}>
        🎯 Resume Analysis
      </h2>

      <div
        style={{
          marginBottom: "2rem",
          padding: "2rem",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <h3 style={{ color: "#3b4a6b", marginBottom: "1rem" }}>📝 Select JD</h3>
        <select
          value={selectedJD}
          onChange={(e) => setSelectedJD(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#f8fafc",
            marginBottom: "2rem",
          }}
        >
          <option value="">-- Select JD --</option>
          {jds.map((jd) => (
            <option key={jd._id} value={jd._id}>
              {jd.name}
            </option>
          ))}
        </select>

        <h3 style={{ color: "#3b4a6b", marginBottom: "1rem" }}>📄 Select Resumes</h3>
        <select
          multiple
          value={selectedCVs}
          onChange={handleResumeSelect}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#f8fafc",
            marginBottom: "2rem",
            height: "160px",
          }}
        >
          {cvs.map((cv) => (
            <option key={cv._id} value={cv._id}>
              {cv.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.9rem",
            fontSize: "1.1rem",
            background: "#4f46e5",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "Analyzing..." : "🔍 Analyze Selected Resumes"}
        </button>
      </div>

      {result?.results?.map((res, index) => (
        <div
          key={res.cvId}
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          <h4 style={{ color: "#334155", marginBottom: "1rem", fontWeight: "600" }}>
            🧑 Candidate {index + 1}
          </h4>

          <p style={{ marginBottom: "0.5rem" }}>
            <strong>✅ Match Score:</strong>{" "}
            <span style={{ color: "#3b82f6", fontWeight: "500" }}>
              {res.matchScore !== null ? `${res.matchScore}%` : "N/A"}
            </span>
          </p>

          <p style={{ marginBottom: "0.5rem" }}>
            <strong>🛠 Skills Found:</strong>{" "}
            <span style={{ color: "#16a34a" }}>{res.skillsFound || "None"}</span>
          </p>

          <p style={{ marginBottom: "0.5rem" }}>
            <strong>❌ Missing Skills:</strong>{" "}
            <span style={{ color: "#dc2626" }}>{res.missingSkills || "None"}</span>
          </p>

          <p style={{ marginBottom: "0.5rem" }}>
            <strong>➕ Additional Skills:</strong>{" "}
            <span style={{ color: "#f97316" }}>{res.additionalSkills || "None"}</span>
          </p>

          <p style={{ marginBottom: "0.5rem" }}>
            <strong>📊 Experience Match:</strong>{" "}
            <span style={{ color: "#0f172a" }}>{res.experienceMatch || "N/A"}</span>
          </p>

          <p style={{ marginBottom: "0.5rem" }}>
            <strong>💡 Reasoning:</strong> {res.detailedReasoning || "N/A"}
          </p>

          {res.error && (
            <p style={{ color: "#dc2626" }}>
              <strong>⚠️ Error:</strong> {res.error}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnalysisPanel;
