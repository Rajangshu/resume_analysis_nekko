from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from datetime import datetime
import os
import requests


from model import (
    AnalysisRequest,
    AnalysisResponse,
    AnalysisResult,
    ChatRequest,
    ChatResponse,
    InterviewRequest,
    InterviewResponse
)
from logic import analyze_with_tavily
from chat_logic import chat_about_resume
from database import get_jd_by_id, get_cv_by_id

app = FastAPI()

# ✅ CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

# ✅ JD vs CV Analysis API
@app.post("/v1/analysis", response_model=AnalysisResponse)
async def create_analysis(payload: AnalysisRequest):
    jd_text = get_jd_by_id(payload.jdId)
    if not jd_text:
        raise HTTPException(status_code=404, detail="JD not found or content missing")

    results = []
    for cv_id in payload.cvIds:
        cv_text = get_cv_by_id(cv_id)
        if not cv_text:
            results.append(AnalysisResult(
                cvId=cv_id,
                matchScore=None,
                skillsFound="",
                missingSkills="",
                additionalSkills="",
                experienceMatch="",
                detailedReasoning="",
                error="CV not found or content missing"
            ))
            continue

        try:
            result = await analyze_with_tavily(jd_text, cv_text)
            result.cvId = cv_id
            results.append(result)
        except Exception as e:
            results.append(AnalysisResult(
                cvId=cv_id,
                matchScore=None,
                skillsFound="",
                missingSkills="",
                additionalSkills="",
                experienceMatch="",
                detailedReasoning="",
                error=f"Analysis failed: {str(e)}"
            ))

    return AnalysisResponse(
        analysisId=str(uuid4()),
        timestamp=datetime.utcnow().isoformat(),
        results=results,
        status="completed"
    )

# ✅ Resume Chat API
@app.post("/v1/chat", response_model=ChatResponse)
async def chat_with_resume(payload: ChatRequest):
    print(f"Incoming chat payload: {payload}")
    answer, conv_id = await chat_about_resume(
        payload.cvId,
        payload.question,
        payload.conversationId
    )
    return ChatResponse(answer=answer, conversationId=conv_id)


@app.post("/v1/interview", response_model=InterviewResponse)
async def generate_interview_questions(payload: InterviewRequest):
    try:
        cv_text = get_cv_by_id(payload.cvId)
        if not cv_text:
            raise HTTPException(status_code=404, detail="Resume not found")

        prompt = f"""
You are an experienced technical interviewer.

Given the candidate's resume below, generate **5 technical interview questions** that:
1. Are based on the **technologies, tools, or frameworks** used in the candidate's projects.
2. Cover essential **core concepts** from the candidate's **engineering domain**.

For **each question**, also generate a **brief ideal answer** that highlights the **key points, keywords, and technical terms in bold and italics** a strong candidate should include.

Resume:
{cv_text}

Difficulty level: {payload.difficulty}/10  
(Where 1 = Beginner and 10 = Expert)

Respond strictly in the following format:

1. Question text  
   **Suggested Answer:** [Ideal technical response with key keywords highlighted]

⚠️ Do not include any introduction or explanation—just return the formatted Q&A list as specified.
"""



        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.5,
                "max_tokens": 524,
            }
        )

        print("OpenRouter response status:", response.status_code)
        print("OpenRouter raw content:", response.text)

        response.raise_for_status()  # catch HTTP errors
        content = response.json()["choices"][0]["message"]["content"]
        questions = [q.strip() for q in content.split("\n") if q.strip()]
        return InterviewResponse(questions=questions)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")

