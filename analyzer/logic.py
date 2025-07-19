import os
import json
import requests
import re
from dotenv import load_dotenv
from model import AnalysisResult
from summarizer import summarize  # LangChain summarization

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def openrouter_match_prompt(jd_text: str, cv_text: str) -> str:
    summarized_jd = summarize(jd_text, doc_type="job description")
    summarized_cv = summarize(cv_text, doc_type="resume")

    return f"""
You are an expert recruiter. Carefully evaluate the following resume against the job description.

Return a VALID JSON object only. No explanation outside the JSON.

Respond in the following format (strictly return only this JSON):

{{
  "matchScore": 85,
  "skillsFound": "Python, Data Analysis, Machine Learning",
  "missingSkills": "Docker, Kubernetes",
  "additionalSkills": "Graphic Design",
  "experienceMatch": "yes",
  "detailedReasoning": "The candidate meets most technical requirements, has strong machine learning experience, but lacks DevOps skills like Docker/Kubernetes."
}}

### JOB DESCRIPTION ###
{summarized_jd}

### CANDIDATE RESUME ###
{summarized_cv}
"""

async def analyze_with_tavily(jd_text: str, cv_text: str) -> AnalysisResult:
    prompt = openrouter_match_prompt(jd_text, cv_text)

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-4o-2024-05-13",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
                "max_tokens": 1024,
            },
            timeout=30
        )

        if response.status_code != 200:
            return AnalysisResult(
                cvId="",
                matchScore=None,
                skillsFound="",
                missingSkills="",
                additionalSkills="",
                experienceMatch="",
                detailedReasoning="",
                error=f"OpenRouter API error: {response.status_code} - {response.text}"
            )

        res_json = response.json()
        content = res_json.get("choices", [{}])[0].get("message", {}).get("content", "").strip()

        # Clean formatting if response wrapped in ```json ... ```
        content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content, flags=re.MULTILINE)

        # Print to debug malformed response if needed
        print("Received model content:\n", content)

        parsed = json.loads(content)

        return AnalysisResult(
            cvId="",
            matchScore=parsed.get("matchScore"),
            skillsFound=parsed.get("skillsFound", ""),
            missingSkills=parsed.get("missingSkills", ""),
            additionalSkills=parsed.get("additionalSkills", ""),
            experienceMatch=parsed.get("experienceMatch", ""),
            detailedReasoning=parsed.get("detailedReasoning", ""),
            error=""
        )

    except Exception as e:
        return AnalysisResult(
            cvId="",
            matchScore=None,
            skillsFound="",
            missingSkills="",
            additionalSkills="",
            experienceMatch="",
            detailedReasoning="",
            error=str(e)
        )
