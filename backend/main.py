from fastapi import FastAPI, UploadFile, File
import shutil
import os

from rag_pipeline import process_pdf
from tutor_engine import ask_tutor
from quiz_engine import generate_quiz
from evaluation_engine import evaluate_answer

from database.db import cursor, conn
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.post("/upload")
def upload_pdf(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    chunks = process_pdf(file_path)

    return {"message": "File uploaded", "chunks": chunks}


@app.post("/ask")
def ask_question(question: str):

    answer = ask_tutor(question)

    return {"answer": answer}


@app.post("/generate_quiz")
def quiz(topic: str):

    quiz = generate_quiz(topic)

    return quiz

@app.post("/submit_quiz")
def submit_quiz(topic: str, question: str, student_answer: str):

    cursor.execute(
        "SELECT correct_answer FROM quiz_questions WHERE question=?",
        (question,)
    )

    result = cursor.fetchone()

    if result is None:
        return {"error": "Question not found in database"}

    correct_answer = result[0]

    evaluation = evaluate_answer(question, student_answer, correct_answer)

    cursor.execute(
        """
        INSERT INTO quiz_results(topic,question,student_answer,correct_answer,score,feedback)
        VALUES(?,?,?,?,?,?)
        """,
        (topic, question, student_answer, correct_answer, 0, evaluation)
    )

    conn.commit()

    return {
        "correct_answer": correct_answer,
        "evaluation": evaluation
    }

@app.get("/analytics")
def analytics():

    cursor.execute("""
    SELECT topic, COUNT(*)
    FROM quiz_results
    GROUP BY topic
    """)

    rows = cursor.fetchall()

    return rows