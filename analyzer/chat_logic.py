from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from bson import ObjectId
import uuid
from dotenv import load_dotenv
from pymongo import MongoClient
from chat_memory import get_memory, save_memory
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL", "mongodb://localhost:27017"))
db = client["resume_analysis"]

def get_cv_content(cv_id: str) -> str:
    doc = db.cvs.find_one({"_id": ObjectId(cv_id)})
    return doc["content"] if doc else ""

async def chat_about_resume(cv_id: str, question: str, conversation_id: str = None):
    resume_text = get_cv_content(cv_id)
    if not resume_text:
        return "Resume not found", conversation_id or str(uuid.uuid4())

    conversation_id = conversation_id or str(uuid.uuid4())
    memory = get_memory(conversation_id)

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant. Answer based only on the given candidate resume."),
        ("human", "Resume:\n" + resume_text),
        ("human", "{question}")
    ])

    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="gpt-3.5-turbo",
        temperature=0.3
    )

    chain = prompt | llm

    # ✅ Attach memory the correct way
    chain = chain.with_config({"memory": memory})

    result = await chain.ainvoke({"question": question})
    save_memory(conversation_id, memory)

    return result.content, conversation_id
