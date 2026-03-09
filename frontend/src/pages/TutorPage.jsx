import React from 'react';
import ChatBox from '../components/ChatBox';

const TutorPage = () => {
    return (
        <div className="p-8 max-w-6xl mx-auto w-full flex-1 flex flex-col h-[calc(100vh-2rem)]">
            <div className="mb-6 flex-shrink-0 animate-in fade-in slide-in-from-top-4">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">AI Tutor Chat</h1>
                <p className="text-slate-500 mt-2 text-lg">Chat with your personalized AI tutor to clarify doubts and master your material.</p>
            </div>
            <div className="flex-1 min-h-0 animate-in fade-in zoom-in-95 duration-500">
                <ChatBox />
            </div>
        </div>
    );
};

export default TutorPage;
