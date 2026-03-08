import requests
from rag_pipeline import retrieve_context
from config import MODEL_NAME, OLLAMA_URL


def ask_tutor(question):

    context = retrieve_context(question)

    prompt = f"""
You are an AI tutor.

Use the study material below to answer clearly.

Study Material:
{context}

Question:
{question}

Explain in simple terms.
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    return data.get("response") or data.get("message", {}).get("content")