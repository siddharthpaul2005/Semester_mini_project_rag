import requests
import json
import re

from rag_pipeline import retrieve_context
from config import MODEL_NAME, OLLAMA_URL
from database.db import cursor, conn


def generate_quiz(topic):

    context = retrieve_context(topic)

    prompt = f"""
Using the study material below generate a quiz.

Study material:
{context}

Return ONLY valid JSON.

Format:

{{
 "questions":[
  {{
   "question":"text",
   "options":["A","B","C","D"],
   "answer":"A"
  }}
 ]
}}
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
        return {"error": "Could not connect to the local LLM. Please make sure Ollama is running (open the Ollama app or run 'ollama serve' in your terminal)."}
    except requests.exceptions.RequestException as e:
        return {"error": f"Error communicating with LLM: {str(e)}"}

    data = response.json()

    result = data.get("response") or data.get("message", {}).get("content")

    # extract JSON safely
    json_match = re.search(r"\{.*\}", result, re.DOTALL)

    if not json_match:
        return {"error": "Model did not return JSON"}

    try:
        quiz = json.loads(json_match.group())
    except json.JSONDecodeError:
        return {"error": "Model returned invalid JSON"}

    if "questions" not in quiz:
        return {"error": "Model response missing 'questions' key"}

    # store answers
    for q in quiz["questions"]:
        cursor.execute(
            """
            INSERT INTO quiz_questions(topic, question, correct_answer)
            VALUES(?,?,?)
            """,
            (topic, q.get("question", ""), q.get("answer", ""))
        )

    conn.commit()

    return quiz