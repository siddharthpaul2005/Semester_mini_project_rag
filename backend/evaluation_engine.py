import requests
from config import MODEL_NAME, OLLAMA_URL


def evaluate_answer(question, student_answer, correct_answer):

    prompt = f"""
You are grading a student's answer.

Question:
{question}

Correct Answer:
{correct_answer}

Student Answer:
{student_answer}

Give score from 0 to 10 and feedback.
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