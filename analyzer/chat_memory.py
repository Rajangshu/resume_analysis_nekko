from langchain.memory import ConversationBufferMemory
from langchain.schema import messages_from_dict, messages_to_dict
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL", "mongodb://localhost:27017"))
db = client["resume_analysis"]

def get_memory(conversation_id: str):
    memory = ConversationBufferMemory(return_messages=True)
    doc = db.chat_history.find_one({"_id": conversation_id})
    if doc:
        memory.chat_memory.messages = messages_from_dict(doc["messages"])
    return memory

def save_memory(conversation_id: str, memory: ConversationBufferMemory):
    messages_dict = messages_to_dict(memory.chat_memory.messages)
    db.chat_history.update_one(
        {"_id": conversation_id},
        {"$set": {"messages": messages_dict}},
        upsert=True
    )
