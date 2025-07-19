const express = require("express");
const router = express.Router();
const upload = require("./multerConfig");
const {
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
} = require("./controller");


// File upload routes
router.post("/upload/jd", upload.single("file"), uploadJD);
router.post("/upload/cv", upload.single("file"), uploadCV);

// Get all uploaded files
router.get("/jds", getAllJDs);
router.get("/cvs", getAllCVs);

// Resume analysis route
router.post("/analyze", analyze);

// ✅ Chatbot route
router.post("/chat", chatWithResume);

//interview question route
// ✅ AI Interview Questions route
router.post("/interview", generateInterviewQuestions);

router.post("/hr/responses", saveHRAnswers); // ✅ same as frontend URL

router.get("/dashboard", getDashboardStats);
router.get("/hr/responses", getHRAnswers); 

const requireAuth = require("./authMiddleware");
router.post("/upload/cv", requireAuth, upload.single("file"), uploadCV);



module.exports = router;
