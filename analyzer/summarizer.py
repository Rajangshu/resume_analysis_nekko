import os
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Setup LLM (uses OpenRouter key for GPT-3.5/4 via LangChain)
llm = ChatOpenAI(
    temperature=0.2,
    model_name="openai/gpt-4o-2024-05-13",
    max_tokens=1024,
    openai_api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"  # Required for OpenRouter
)

# Prompt template for summarizing long texts
summary_prompt = PromptTemplate(
    input_variables=["doc_type", "text"],
    template="""
You are an expert at summarizing {doc_type} documents.

Given the following {doc_type}, create a clean, concise summary focusing on key responsibilities, qualifications, skills, and experience:

{text}

Return a professional summary in under 300 words.
"""
)

summary_chain = LLMChain(llm=llm, prompt=summary_prompt)

def summarize(text: str, doc_type: str = "document") -> str:
    """
    Summarizes a given text (JD or CV) using the LangChain LLM pipeline.

    Args:
        text (str): The full JD or resume text.
        doc_type (str): Either "job description" or "resume".

    Returns:
        str: Summarized version of the input.
    """
    try:
        result = summary_chain.run({"doc_type": doc_type, "text": text})
        return result.strip()
    except Exception as e:
        return f"[Summary failed due to error: {e}]"
