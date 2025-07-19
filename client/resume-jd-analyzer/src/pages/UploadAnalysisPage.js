import React, { useEffect, useState } from "react";
import UploadPanel from "../components/UploadPanel";
import AnalysisPanel from "../components/AnalysisPanel";
import axios from "axios";

const UploadAnalysisPage = () => {
  const [jds, setJDs] = useState([]);
  const [cvs, setCVs] = useState([]);

  const loadData = async () => {
    try {
      const jdRes = await axios.get("http://localhost:5000/api/jds");
      const cvRes = await axios.get("http://localhost:5000/api/cvs");
      setJDs(jdRes.data);
      setCVs(cvRes.data);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      {/* Branding Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "800", color: "#1e40af" }}>
          SkillMatch <span style={{ color: "#facc15" }}>AI</span>
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#6b7280", fontStyle: "italic" }}>
          Empowering Recruiters with AI-driven Resume Insights
        </p>
      </div>

      {/* Upload & Analysis Layout */}
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <UploadPanel refreshData={loadData} />
        <AnalysisPanel jds={jds} cvs={cvs} />
      </div>
    </div>
  );
};

export default UploadAnalysisPage;
