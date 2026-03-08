import sqlite3

conn = sqlite3.connect("tutor.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS quiz_questions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT,
    question TEXT,
    correct_answer TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS quiz_results(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT,
    question TEXT,
    student_answer TEXT,
    correct_answer TEXT,
    score INTEGER,
    feedback TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()