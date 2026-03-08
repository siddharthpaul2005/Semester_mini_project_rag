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

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    result = data.get("response") or data.get("message", {}).get("content")

    # extract JSON safely
    json_match = re.search(r"\{.*\}", result, re.DOTALL)

    if not json_match:
        return {"error": "Model did not return JSON"}

    quiz = json.loads(json_match.group())

    # store answers
    for q in quiz["questions"]:
        cursor.execute(
            """
            INSERT INTO quiz_questions(topic, question, correct_answer)
            VALUES(?,?,?)
            """,
            (topic, q["question"], q["answer"])
        )

    conn.commit()

    return quiz