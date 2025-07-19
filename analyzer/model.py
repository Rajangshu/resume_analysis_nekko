from pydantic import BaseModel
from typing import List, Optional

# ---------- Existing Models ----------
class AnalysisRequest(BaseModel):
    jdId: str
    cvIds: List[str]
    options: Optional[dict] = {}

class AnalysisResult(BaseModel):
    cvId: str
    matchScore: Optional[int]
    skillsFound: str
    missingSkills: str
    additionalSkills: str
    experienceMatch: str
    detailedReasoning: str
    error: Optional[str] = None

class AnalysisResponse(BaseModel):
    analysisId: str
    timestamp: str
    results: List[AnalysisResult]
    status: str

# ---------- Chat Models ----------
class ChatRequest(BaseModel):
    cvId: str
    question: str
    conversationId: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    conversationId: str
    
class InterviewRequest(BaseModel):
    cvId: str
    difficulty: int  # 1 to 10

class InterviewResponse(BaseModel):
    questions: List[str]
    
