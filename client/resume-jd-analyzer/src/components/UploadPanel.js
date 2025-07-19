import React, { useState, useEffect } from "react";
import axios from "axios";

const styles = `
.upload-slide {
  animation: slideIn 0.4s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}
@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.upload-btn {
  border: none;
  padding: 0.6rem 1.3rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
.upload-btn:hover {
  transform: scale(1.03);
}
.upload-jd {
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
  color: white;
}
.upload-cv {
  background: linear-gradient(to right, #22c55e, #16a34a);
  color: white;
}
.upload-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
.upload-panel-box {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(44, 62, 80, 0.08);
  margin-bottom: 2rem;
  transition: box-shadow 0.3s;
}
.upload-panel-box:hover {
  box-shadow: 0 6px 14px rgba(44, 62, 80, 0.12);
}
.upload-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  margin-bottom: 1rem;
  transition: border 0.2s, box-shadow 0.2s;
}
.upload-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #93c5fd;
  outline: none;
}
`;

const UploadPanel = ({ refreshData }) => {
  const [jdFile, setJdFile] = useState(null);
  const [cvFiles, setCvFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!document.getElementById("upload-style")) {
      const style = document.createElement("style");
      style.id = "upload-style";
      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  }, []);

  const handleJDUpload = async () => {
    if (!jdFile) {
      alert("Please select a JD file first.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", jdFile);

      await axios.post("http://localhost:5000/api/upload/jd", formData);
      alert("✅ JD uploaded successfully!");
      refreshData();
      setJdFile(null);
    } catch (error) {
      console.error("JD upload error:", error);
      alert("❌ Failed to upload JD.");
    } finally {
      setUploading(false);
    }
  };

  const handleCVUpload = async () => {
    if (cvFiles.length === 0) {
      alert("Please select at least one CV file.");
      return;
    }

    try {
      setUploading(true);
      for (const file of cvFiles) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post("http://localhost:5000/api/upload/cv", formData);
      }
      alert("✅ Resumes uploaded successfully!");
      refreshData();
      setCvFiles([]);
    } catch (error) {
      console.error("Resume upload error:", error);
      alert("❌ Failed to upload resumes.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        borderRight: "1px solid #e2e8f0",
        width: "38%",
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f0f4f8, #dbeafe)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ color: "#1e293b", marginBottom: "2rem", fontSize: "1.8rem", fontWeight: 700 }}>
        Upload Panel
      </h2>

      {/* JD Upload Section */}
      <div className="upload-panel-box upload-slide">
        <h3 style={{ color: "#334155", marginBottom: "1rem" }}>Upload JD</h3>
        <input
          type="file"
          onChange={(e) => setJdFile(e.target.files[0])}
          className="upload-input"
        />
        <button
          onClick={handleJDUpload}
          disabled={uploading}
          className="upload-btn upload-jd"
        >
          {uploading ? "Uploading..." : "Upload JD"}
        </button>
      </div>

      {/* CV Upload Section */}
      <div className="upload-panel-box upload-slide">
        <h3 style={{ color: "#334155", marginBottom: "1rem" }}>Upload Resumes</h3>
        <input
          type="file"
          multiple
          onChange={(e) => setCvFiles(Array.from(e.target.files))}
          className="upload-input"
        />
        <button
          onClick={handleCVUpload}
          disabled={uploading}
          className="upload-btn upload-cv"
        >
          {uploading ? "Uploading..." : "Upload Resumes"}
        </button>
      </div>
    </div>
  );
};

export default UploadPanel;
