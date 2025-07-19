# analyzer/database.py
from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017")
db = client["resume_analysis"]
jd_collection = db["jds"]
cv_collection = db["cvs"]

def get_jd_by_id(jd_id: str):
    jd = jd_collection.find_one({"_id": ObjectId(jd_id)})
    return jd["content"] if jd and "content" in jd else None

def get_cv_by_id(cv_id: str):
    cv = cv_collection.find_one({"_id": ObjectId(cv_id)})
    return cv["content"] if cv and "content" in cv else None

