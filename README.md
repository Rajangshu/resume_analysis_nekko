# 🧠 SkillMatch AI

SkillMatch AI is a full-stack AI-powered Resume Intelligence platform that empowers recruiters and job platforms to analyze resumes against job descriptions, chat with resumes, generate AI interview questions, and collect HR data from candidates — all with a sleek dashboard.

---

## ✨ Features

- 📄 Upload and analyze multiple resumes vs job descriptions
- 🤖 Chat with resume using GPT-based AI
- ❓ Generate interview questions based on skillset + difficulty level
- 📋 Collect HR questionnaire responses (relocation, timings, etc.)
- 📊 Beautiful HR analytics dashboard with real-time data

---

## ⚙️ Tech Stack

| Layer         | Tech Used                                     |
|---------------|-----------------------------------------------|
| **Frontend**  | React.js, Tailwind CSS, Recharts              |
| **Backend**   | Node.js (Express), MongoDB                    |
| **AI Engine** | Python (FastAPI), LangChain, OpenRouter GPT   |
| **Database**  | MongoDB (Local or Cloud)

---

## 📁 Folder Structure

resume_skill/
├── analyzer/ # FastAPI AI logic with LangChain
│ ├── main.py # API entrypoint
│ ├── summarizer.py # JD/Resume summarizer
│ ├── logic.py # Matching & scoring logic
│ └── ...
├── server/ # Node.js Express backend
│ ├── server.js # File handling + MongoDB
│ └── ...
├── client/
│ └── resume-jd-analyzer/ # React frontend
│ ├── src/
│ ├── public/screenshot.png
│ └── ...
├── README.md # You're here!
└── .gitignore


---

## 🧑‍💻 Local Development Setup

> Ensure you have installed:
> - Python 3.9+
> - Node.js & npm
> - MongoDB running on `localhost:27017`

---

### 1️⃣ Start the AI Backend (FastAPI + LangChain)

```
cd analyzer
uvicorn main:app --reload --port 8000
```

🧠 LangChain deprecation warnings may appear — safe to ignore or update later.

2️⃣ Start the Node.js + MongoDB Backend:
```
cd server
node server.js
URL: http://localhost:5000
```

✅ Ensure MongoDB is running before this step.

3️⃣ Start the React Frontend
```
cd client/resume-jd-analyzer
npm install
npm start
```

🔐 Environment Variables
Create the following .env files in their respective folders:

analyzer/.env:

OPENROUTER_API_KEY=your_openrouter_api_key


server/.env:

MONGODB_URI=mongodb://localhost:27017/resume_analysis

PORT=5000

Replace with your actual API key and database URI as needed.

🤝 Contributing:
Pull requests and issue suggestions are welcome!

👨‍💼 Author
Rajangshu Kumar

📧 Email: rajangshukumar@gmail.com

🔗 GitHub: github.com/Rajangshu

🔗 LinkedIn:www.linkedin.com/in/rajangshu-kumar-841116250



