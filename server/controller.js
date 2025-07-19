const { JDModel, CVModel } = require("./models");
const { HRAnswerModel } = require("./models");

const fs = require("fs");
const pdfParse = require("pdf-parse");
const axios = require("axios");

// ✅ Upload JD
const uploadJD = async (req, res) => {
  try {
    const content = fs.readFileSync(req.file.path, "utf-8");

    const jd = await JDModel.create({
      name: req.file.originalname,
      filePath: req.file.path,
      content,
    });

    res.json(jd);
  } catch (error) {
    console.error("JD Upload Error:", error.message);
    res.status(500).json({ error: "Failed to upload JD" });
  }
};

// ✅ Upload CV
const uploadCV = async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const parsed = await pdfParse(dataBuffer);

    const cv = await CVModel.create({
      name: req.file.originalname,
      filePath: req.file.path,
      content: parsed.text,
    });

    res.json(cv);
  } catch (error) {
    console.error("CV upload failed:", error);
    res.status(500).json({ error: "CV upload failed" });
  }
};

// ✅ Get all JDs
const getAllJDs = async (_, res) => {
  try {
    const jds = await JDModel.find();
    res.json(jds);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch JDs" });
  }
};

// ✅ Get all CVs
const getAllCVs = async (_, res) => {
  try {
    const cvs = await CVModel.find();
    res.json(cvs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch CVs" });
  }
};

// ✅ Analyze JD vs CVs
const analyze = async (req, res) => {
  try {
    const { jdId, cvIds } = req.body;

    const jd = await JDModel.findById(jdId);
    const cvs = await CVModel.find({ _id: { $in: cvIds } });

    if (!jd || cvs.length === 0) {
      return res.status(400).json({ error: "JD or CVs not found" });
    }

    const pythonResponse = await axios.post("http://localhost:8000/v1/analysis", {
      jdId: jd._id.toString(),
      cvIds: cvs.map(cv => cv._id.toString()),
    });

    res.json(pythonResponse.data);
  } catch (error) {
    console.error("Analysis error:", error.message);
    res.status(500).json({ error: "Failed to analyze resumes" });
  }
};

// ✅ Chat with Resume
const chatWithResume = async (req, res) => {
  try {
    const { resumeId, message, conversationId } = req.body;

    const response = await axios.post("http://localhost:8000/v1/chat", {
      cvId: resumeId,
      question: message,
      conversationId,
    });

    res.json({
      response: response.data.answer,
      conversation_id: response.data.conversationId,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    res.status(500).json({ error: "Failed to chat with resume" });
  }
};

// ✅ Interview Question Generator
const generateInterviewQuestions = async (req, res) => {
  try {
    const { cvId, difficulty } = req.body;
    const resume = await CVModel.findById(cvId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const response = await axios.post("http://localhost:8000/v1/interview", {
       cvId,        
       difficulty,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Interview generation error:", error.message);
    res.status(500).json({ error: "Failed to generate interview questions" });
  }
};



const saveHRAnswers = async (req, res) => {
  try {
    const { cvId, responses } = req.body;
    const saved = await HRAnswerModel.create({ cvId, ...responses });
    res.json(saved);
  } catch (err) {
    console.error("Failed to save HR answers:", err);
    res.status(500).json({ error: "Failed to save HR questionnaire" });
  }
};





const getDashboardStats = async (req, res) => {
  try {
    const totalCVs = await CVModel.countDocuments();
    const totalJDs = await JDModel.countDocuments();
    const totalHRAnswers = await HRAnswerModel.countDocuments();

    res.json({ totalCVs, totalJDs, totalHRAnswers });
  } catch (err) {
    console.error("Dashboard stats fetch failed:", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};

const getHRAnswers = async (req, res) => {
  try {
    const answers = await HRAnswerModel.find();
    res.json(answers);
  } catch (err) {
    console.error("Failed to get HR answers:", err);
    res.status(500).json({ error: "Failed to fetch HR answers" });
  }
};

module.exports = {
  uploadJD,
  uploadCV,
  getAllJDs,
  getAllCVs,
  analyze,
  chatWithResume,
  generateInterviewQuestions,
  saveHRAnswers,
  getDashboardStats,
  getHRAnswers
};
