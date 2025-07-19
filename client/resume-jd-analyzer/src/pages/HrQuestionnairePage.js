import React, { useState, useEffect } from "react";
import axios from "axios";

// Modern CSS for the questionnaire page
const styles = `
.hrq-container {
  padding: 2.5rem 1.5rem;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  max-width: 820px;
  margin: 3rem auto 2rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(30, 64, 175, 0.11), 0 1.5px 6px rgba(0,0,0,0.06);
  animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px);}
  to   { opacity: 1; transform: translateY(0);}
}

.hrq-title {
  margin-bottom: 1.2rem;
  font-size: 2.1rem;
  font-weight: 700;
  color: #1e40af;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hrq-section-title {
  color: #1e40af;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  letter-spacing: 0.2px;
  border-left: 4px solid #1e40af;
  padding-left: 0.7rem;
  background: linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%);
  border-radius: 6px;
  animation: slideIn 0.7s;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-30px);}
  to   { opacity: 1; transform: translateX(0);}
}

.hrq-select-resume {
  margin-bottom: 2rem;
}

.hrq-label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  color: #344054;
  font-size: 1rem;
}

.hrq-select,
.hrq-textarea {
  padding: 0.65rem;
  width: 100%;
  border: 1.5px solid #b6c3e2;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 0.1rem;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.hrq-select:focus,
.hrq-textarea:focus {
  border-color: #1e40af;
  box-shadow: 0 0 0 2px #c7d6f7;
  outline: none;
}

.hrq-question-block {
  margin-bottom: 1.7rem;
  animation: fadeIn 0.6s;
}

.hrq-success {
  background: linear-gradient(90deg, #d1e7dd 0%, #b2f2e5 100%);
  padding: 1.2rem;
  border-radius: 10px;
  color: #0f5132;
  font-weight: 600;
  text-align: center;
  margin-top: 2rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.09);
  animation: fadeIn 0.7s;
}

.hrq-submit-btn {
  padding: 0.85rem 1.5rem;
  background: linear-gradient(90deg, #1e40af 60%, #3b82f6 100%);
  color: #fff;
  border: none;
  border-radius: 7px;
  margin-top: 2.2rem;
  width: 100%;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.1px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.09);
  transition: background 0.18s, transform 0.14s;
  animation: fadeIn 1s;
}

.hrq-submit-btn:hover,
.hrq-submit-btn:focus {
  background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
  transform: translateY(-2px) scale(1.03);
}

@media (max-width: 600px) {
  .hrq-container {
    padding: 1rem;
    max-width: 98vw;
  }
  .hrq-title { font-size: 1.3rem; }
  .hrq-section-title { font-size: 1rem; }
}
`;

const HRQuestionnairePage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedCV, setSelectedCV] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [responses, setResponses] = useState({
    relocate: "",
    workHours: "",
    salaryExpectation: "",
    noticePeriod: "",
    remotePreference: "",
    employmentType: "",
    expectedJoining: "",
    workFromOffice: "",
    preferredLocation: "",
    careerGoal: "",
    certifications: "",
    teamOrSolo: "",
    strengths: "",
    weaknesses: "",
    longTermAvailability: "",
  });

  const handleChange = (e) => {
    setResponses({ ...responses, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!selectedCV) return alert("Select a resume!");
    try {
      await axios.post("http://localhost:5000/api/hr/responses", {
        cvId: selectedCV,
        responses,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  useEffect(() => {
    // Inject CSS only once
    if (!document.getElementById("hrq-styles")) {
      const style = document.createElement("style");
      style.id = "hrq-styles";
      style.innerHTML = styles;
      document.head.appendChild(style);
    }
    axios.get("http://localhost:5000/api/cvs").then((res) => {
      setResumes(res.data);
    });
  }, []);

  const questionBlock = (label, name, options = null, isTextarea = false) => (
    <div className="hrq-question-block">
      <label className="hrq-label">{label}</label>
      {options ? (
        <select
          className="hrq-select"
          name={name}
          value={responses[name]}
          onChange={handleChange}
        >
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <textarea
          className="hrq-textarea"
          name={name}
          value={responses[name]}
          onChange={handleChange}
          rows={3}
        />
      )}
    </div>
  );

  return (
    <div className="hrq-container">
      <h2 className="hrq-title">📋 HR Candidate Questionnaire</h2>

      {submitted ? (
        <div className="hrq-success">
          ✅ Your responses have been submitted successfully!
        </div>
      ) : (
        <>
          <div className="hrq-select-resume">
            <label className="hrq-label">Select Resume:</label>
            <select
              className="hrq-select"
              value={selectedCV}
              onChange={(e) => setSelectedCV(e.target.value)}
            >
              <option value="">-- Select Candidate Resume --</option>
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* SECTION 1: General Info */}
          <h3 className="hrq-section-title">👤 General Info</h3>
          {questionBlock("Are you open to relocation?", "relocate", ["Yes", "No", "Depends"])}
          {questionBlock("Preferred working hours?", "workHours", ["Morning", "Evening", "Flexible"])}
          {questionBlock("Notice Period", "noticePeriod", ["0 Days", "15 Days", "30+ Days"])}

          {/* SECTION 2: Job Preferences */}
          <h3 className="hrq-section-title">🏢 Job Preferences</h3>
          {questionBlock("Expected Salary?", "salaryExpectation", ["< 5 LPA", "5–10 LPA", "10–15 LPA", "> 15 LPA"])}
          {questionBlock("Remote or On-site preference?", "remotePreference", ["Remote", "On-site", "Hybrid"])}
          {questionBlock("Would you prefer working from office full time?", "workFromOffice", ["Yes", "No", "Open to discuss"])}
          {questionBlock("Preferred job location?", "preferredLocation")}
          {questionBlock("Expected joining timeline?", "expectedJoining", ["Immediately", "1–2 Weeks", "1 Month", "Later"])}
          {questionBlock("Preferred employment type?", "employmentType", ["Full-time", "Part-time", "Internship", "Contract"])}

          {/* SECTION 3: Personal & Career */}
          <h3 className="hrq-section-title">🧠 Personal & Career Insights</h3>
          {questionBlock("Your long-term career goal?", "careerGoal", null, true)}
          {questionBlock("Any certifications or additional training?", "certifications", null, true)}
          {questionBlock("Do you prefer working alone or in teams?", "teamOrSolo", ["Alone", "Teams", "Either"])}
          {questionBlock("Your strengths (brief)?", "strengths", null, true)}
          {questionBlock("Your weaknesses (brief)?", "weaknesses", null, true)}
          {questionBlock("How long do you see yourself with the company?", "longTermAvailability", null, true)}

          <button
            className="hrq-submit-btn"
            onClick={handleSubmit}
          >
            Submit Responses
          </button>
        </>
      )}
    </div>
  );
};

export default HRQuestionnairePage;
