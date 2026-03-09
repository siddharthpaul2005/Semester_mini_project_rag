import React, { useState } from 'react';
import { generateQuiz, submitQuiz } from '../api/api';
import { FileQuestion, Loader2, Target, CheckCircle2, HelpCircle, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';

const QuizPage = () => {
    const [topic, setTopic] = useState('');
    const [loadingGenerate, setLoadingGenerate] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');

    const [answersState, setAnswersState] = useState({});

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoadingGenerate(true);
        setQuestions([]);
        setAnswersState({});
        setError('');

        try {
            const res = await generateQuiz(topic);
            if (res.data && res.data.questions) {
                setQuestions(res.data.questions);
            } else {
                setError("Invalid response format from server.");
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate quiz.');
        } finally {
            setLoadingGenerate(false);
        }
    };

    const handleSelectOption = async (questionIndex, questionText, optionText) => {
        if (answersState[questionIndex]?.result || answersState[questionIndex]?.loading) return;

        setAnswersState(prev => ({
            ...prev,
            [questionIndex]: { selectedOption: optionText, loading: true }
        }));

        try {
            const res = await submitQuiz(topic, questionText, optionText);
            setAnswersState(prev => ({
                ...prev,
                [questionIndex]: {
                    selectedOption: optionText,
                    loading: false,
                    result: {
                        correctAnswer: res.data.correct_answer,
                        feedback: res.data.evaluation
                    }
                }
            }));
        } catch (err) {
            console.error(err);
            setAnswersState(prev => ({
                ...prev,
                [questionIndex]: { ...prev[questionIndex], loading: false, error: 'Failed to submit' }
            }));
        }
    };

    return (
        <div className="p-10 max-w-6xl mx-auto w-full flex-1 flex flex-col h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar animate-in fade-in">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">AI Quiz Generator</h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">Test your knowledge dynamically. Enter any topic and our AI will generate a personalized quiz to evaluate your understanding in real-time.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 mb-10 max-w-3xl mx-auto w-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 opacity-50"></div>
                <form onSubmit={handleGenerate} className="flex flex-col gap-5 relative z-10">
                    <label className="font-bold text-slate-700 flex items-center gap-3 text-lg">
                        <Target className="w-6 h-6 text-indigo-500" /> Topic of Interest:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Data Structures, Machine Learning, World History..."
                            className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 transition-all font-semibold text-lg hover:bg-white"
                        />
                        <button
                            type="submit"
                            disabled={!topic.trim() || loadingGenerate}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 text-lg cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loadingGenerate ? <Loader2 className="w-6 h-6 animate-spin" /> : <BrainCircuit className="w-6 h-6" />}
                            {loadingGenerate ? 'Generating...' : 'Start Quiz'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 font-medium mt-2 p-3 bg-red-50 rounded-lg border border-red-100">{error}</p>}
                </form>
            </div>

            <div className="flex flex-col gap-10 pb-16 w-full max-w-4xl mx-auto">
                {questions.map((q, idx) => {
                    const state = answersState[idx] || {};
                    const isSubmitted = !!state.result;
                    return (
                        <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md animate-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="px-10 py-8 bg-slate-50/80 border-b border-slate-200 flex items-start gap-5 relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-tl-3xl"></div>
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-indigo-700 font-extrabold border-2 border-indigo-200 text-lg shadow-sm">
                                    {idx + 1}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 leading-snug pt-1 font-serif tracking-tight">{q.question}</h3>
                            </div>

                            <div className="p-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                    {q.options.map((opt, optIdx) => {
                                        const isSelected = state.selectedOption === opt;
                                        const isCorrect = isSubmitted && opt === state.result.correctAnswer;
                                        const isWrong = isSubmitted && isSelected && opt !== state.result.correctAnswer;

                                        return (
                                            <button
                                                key={optIdx}
                                                onClick={() => handleSelectOption(idx, q.question, opt)}
                                                disabled={isSubmitted || state.loading}
                                                className={clsx(
                                                    "px-6 py-5 rounded-2xl border-2 text-left font-semibold transition-all text-lg flex items-center gap-4 overflow-hidden group",
                                                    isCorrect
                                                        ? "bg-green-100 border-green-500 text-green-900 shadow-inner"
                                                        : isWrong
                                                            ? "bg-red-50 border-red-400 text-red-800"
                                                            : isSelected
                                                                ? "bg-indigo-100 border-indigo-500 text-indigo-900 shadow-md transform scale-[1.02]"
                                                                : "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-slate-50 hover:shadow-sm cursor-pointer",
                                                    (isSubmitted || state.loading) && !isCorrect && !isWrong && !isSelected && "opacity-50 grayscale cursor-not-allowed border-slate-200"
                                                )}
                                            >
                                                <span className={clsx("inline-flex w-10 h-10 items-center justify-center rounded-xl font-bold bg-white border border-slate-200 shadow-sm transition-colors",
                                                    isCorrect ? "text-green-600 border-green-300" : isWrong ? "text-red-500 border-red-300" : isSelected ? "text-indigo-600 border-indigo-300" : "text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-200"
                                                )}>
                                                    {String.fromCharCode(65 + optIdx)}
                                                </span>
                                                <span className="flex-1">{opt}</span>
                                            </button>
                                        )
                                    })}
                                </div>

                                {state.loading && (
                                    <div className="flex items-center gap-4 text-indigo-700 font-bold bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-lg shadow-inner">
                                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" /> Evaluating your answer...
                                    </div>
                                )}

                                {state.result && (
                                    <div className={clsx(
                                        "p-8 rounded-2xl border flex flex-col gap-4 mt-6 animate-in zoom-in-95 duration-300 shadow-sm relative overflow-hidden",
                                        state.selectedOption === state.result.correctAnswer
                                            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                                            : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                                    )}>
                                        <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm pointer-events-none">
                                            {state.selectedOption === state.result.correctAnswer ? <CheckCircle2 className="w-32 h-32 text-green-600" /> : <HelpCircle className="w-32 h-32 text-amber-600" />}
                                        </div>

                                        <div className="flex items-center gap-3 font-extrabold text-2xl relative z-10">
                                            {state.selectedOption === state.result.correctAnswer ? (
                                                <>
                                                    <CheckCircle2 className="w-8 h-8 text-green-600 stroke-[2.5]" />
                                                    <span className="text-green-800">Excellent!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <HelpCircle className="w-8 h-8 text-amber-600 stroke-[2.5]" />
                                                    <span className="text-amber-800">Needs Review</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="text-slate-700 bg-white/80 p-5 rounded-xl border border-slate-200/50 shadow-sm relative z-10 flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                                            <span className="font-bold text-slate-800 uppercase tracking-widest text-xs opacity-70">Correct Answer</span>
                                            <span className="text-slate-900 font-black text-lg">{state.result.correctAnswer}</span>
                                        </div>

                                        <div className="text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed relative z-10 text-lg">
                                            <span className="font-bold block mb-2 text-slate-900 uppercase tracking-widest text-xs opacity-70">AI Feedback</span>
                                            {state.result.feedback}
                                        </div>
                                    </div>
                                )}

                                {state.error && <p className="text-red-500 mt-5 font-bold p-4 bg-red-50 rounded-xl">{state.error}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizPage;
