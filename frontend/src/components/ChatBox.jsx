import React, { useState, useRef, useEffect } from 'react';
import { askQuestion } from '../api/api';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const ChatBox = () => {
    const [messages, setMessages] = useState([
        { role: 'tutor', content: 'Hello! I am your AI Tutor. Ask me any question based on the materials you have uploaded.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const res = await askQuestion(userMessage);
            setMessages(prev => [...prev, { role: 'tutor', content: res.data.answer }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'tutor', content: 'I encountered an error trying to answer your question. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 z-10"></div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/95 scroll-smooth relative">
                {messages.map((msg, idx) => (
                    <div key={idx} className={clsx("flex w-full gap-4", msg.role === 'user' ? "justify-end" : "justify-start animate-in fade-in slide-in-from-bottom-2")}>
                        {msg.role === 'tutor' && (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 text-indigo-600 shadow-sm border border-indigo-200 z-10">
                                <Bot className="w-7 h-7" />
                            </div>
                        )}

                        <div className={clsx(
                            "px-6 py-4 rounded-3xl max-w-[85%] shadow-sm leading-relaxed",
                            msg.role === 'user'
                                ? "bg-indigo-600 text-white rounded-br-sm"
                                : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                        )}>
                            <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600 shadow-sm border border-slate-300 z-10">
                                <User className="w-7 h-7" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex w-full gap-4 justify-start animate-in fade-in">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0 text-indigo-600 shadow-sm border border-indigo-200 z-10">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-800 rounded-bl-sm flex items-center gap-3 shadow-sm">
                            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                            <span className="text-indigo-600 font-bold tracking-wide">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={endOfMessagesRef} />
            </div>

            <div className="p-5 bg-white border-t border-slate-100 z-20">
                <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your study material..."
                        className="w-full pl-6 pr-16 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white text-lg font-medium shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-95"
                    >
                        <Send className="w-6 h-6 pl-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;
