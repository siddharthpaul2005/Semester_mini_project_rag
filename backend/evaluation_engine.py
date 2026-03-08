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