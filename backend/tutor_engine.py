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

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            }
        )
        response.raise_for_status()
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to the local LLM. Please make sure Ollama is running (open the Ollama app or run 'ollama serve' in your terminal)."
    except requests.exceptions.RequestException as e:
        return f"Error communicating with LLM: {str(e)}"

    data = response.json()

    return data.get("response") or data.get("message", {}).get("content")