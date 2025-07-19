import React, { useState, useEffect } from "react";
import axios from "axios";

// Scoped styles for the interview panel
const styles = `
.interview-fullpage {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-y: auto;
}
.interview-header {
  text-align: center;
  font-size: 2.3rem;
  font-weight: 800;
  color: #1e40af;
  margin: 2.5rem 0 2rem 0;
  letter-spacing: 0.5px;
}
.interview-form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 0 10vw;
  width: 100%;
  box-sizing: border-box;
}
.interview-label {
  font-weight: 700;
  font-size: 1.1rem;
  margin: 1.2rem 0 0.7rem 0;
  color: #1e40af;
}
.interview-select,
.interview-input-range {
  width: 100%;
  padding: 1rem 1.1rem;
  font-size: 1.1rem;
  border: 2px solid #b6c3e2;
  border-radius: 10px;
  background: #f8fafc;
  margin-bottom: 1.7rem;
  font-weight: 600;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.interview-select:focus,
.interview-input-range:focus {
  border-color: #1e40af;
  box-shadow: 0 0 0 2px #c7d6f7;
  outline: none;
}
.interview-button {
  padding: 1.1rem 0;
  background: linear-gradient(90deg, #1e40af 60%, #3b82f6 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.18rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.09);
  transition: background 0.18s, transform 0.14s;
  width: 100%;
  margin-bottom: 2rem;
  letter-spacing: 0.04em;
}
.interview-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  box-shadow: none;
}
.interview-button:hover:not(:disabled),
.interview-button:focus:not(:disabled) {
  background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
  transform: translateY(-2px) scale(1.03);
  outline: none;
}
.interview-questions {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.3rem 1rem;
  font-size: 1.08rem;
  color: #22223b;
  margin-top: 1.5rem;
  word-break: break-word;
  width: 100%;
  box-sizing: border-box;
}
.interview-questions h4 {
  margin-bottom: 1rem;
  color: #1e40af;
  font-weight: 800;
  font-size: 1.15rem;
}
.interview-questions ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}
.interview-questions li {
  margin-bottom: 0.8rem;
  font-size: 1.08rem;
  font-weight: 600;
}
@media (max-width: 900px) {
  .interview-form-section {
    padding: 0 5vw;
  }
  .interview-header {
    font-size: 1.8rem;
  }
}
`;

const InterviewPanel = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [difficulty, setDifficulty] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Inject CSS only once
    const styleId = "interview-styles";
    if (!document.getElementById(styleId)) {
      const styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.innerHTML = styles;
      document.head.appendChild(styleTag);
    }

    // Fetch resumes
    axios.get("http://localhost:5000/api/cvs")
      .then((res) => setResumes(res.data))
      .catch((err) => console.error("Failed to load resumes:", err));
  }, []);

  const handleGenerate = async () => {
    if (!selectedResumeId) {
      alert("Please select a resume");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/interview", {
        cvId: selectedResumeId,
        difficulty: parseInt(difficulty),
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Failed to generate questions:", error);
      alert("Error generating questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-fullpage">
      <div className="interview-header">
        AI-Powered Interview Question Generator
      </div>
      <div className="interview-form-section">
        <label className="interview-label" htmlFor="resume-select">
          Select Resume
        </label>
        <select
          id="resume-select"
          className="interview-select"
          value={selectedResumeId}
          onChange={(e) => setSelectedResumeId(e.target.value)}
        >
          <option value="">Select Resume</option>
          {resumes.map((resume) => (
            <option key={resume._id} value={resume._id}>
              {resume.name}
            </option>
          ))}
        </select>

        <label className="interview-label" htmlFor="difficulty-range">
          Difficulty: {difficulty}/10
        </label>
        <input
          id="difficulty-range"
          type="range"
          min="1"
          max="10"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="interview-input-range"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="interview-button"
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {questions.length > 0 && (
          <div className="interview-questions">
            <h4>Generated Questions:</h4>
            <ul>
              {questions.map((q, index) => (
                <li key={index}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPanel;
