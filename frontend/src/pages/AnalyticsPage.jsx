import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../api/api';
import { BarChart3, TrendingUp, AlertCircle, Loader2, Sparkles, Target } from 'lucide-react';

const AnalyticsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await getAnalytics();
            const formattedData = Array.isArray(res.data)
                ? res.data.map((item, id) => ({ id: id, topic: item[0], count: item[1] }))
                : [];
            setData(formattedData);
        } catch (err) {
            console.error(err);
            setError('Failed to load analytics.');
        } finally {
            setLoading(false);
        }
    };

    const totalAttempts = data.reduce((acc, curr) => acc + curr.count, 0);
    const maxAttempts = data.length > 0 ? Math.max(...data.map(d => d.count)) : 0;

    return (
        <div className="p-10 max-w-7xl mx-auto w-full flex-1 flex flex-col h-[calc(100vh-2rem)] overflow-y-auto animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">Learning Analytics</h1>
                    <p className="text-slate-500 text-lg max-w-xl">Track your quiz attempts and topic mastery. See where you are focusing your learning efforts.</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-3xl shadow-xl flex items-center gap-5 pr-10 transform transition-transform hover:scale-[1.02]">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                        <TrendingUp className="w-10 h-10" />
                    </div>
                    <div>
                        <div className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-1">Total Quiz Attempts</div>
                        <div className="text-5xl font-black">{totalAttempts}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col relative">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 z-10"></div>
                <div className="p-8 bg-slate-50/80 border-b border-slate-200 font-extrabold text-slate-800 flex items-center justify-between text-xl z-20">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-indigo-500" />
                        Topic Breakdown
                    </div>
                    {data.length > 0 && (
                        <span className="text-sm font-semibold bg-white px-4 py-2 border border-slate-200 rounded-xl text-slate-500 shadow-sm flex items-center gap-2">
                            <Target className="w-4 h-4 text-indigo-400" />
                            {data.length} Topics Studied
                        </span>
                    )}
                </div>

                <div className="p-10 flex-1 overflow-y-auto z-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-32 gap-6 text-indigo-600">
                            <Loader2 className="w-12 h-12 animate-spin" />
                            <p className="font-extrabold text-xl animate-pulse">Computing learning trajectories...</p>
                        </div>
                    ) : error ? (
                        <div className="flex items-center gap-4 text-red-700 bg-red-50 p-8 rounded-2xl border border-red-200 font-bold justify-center text-lg shadow-inner">
                            <AlertCircle className="w-8 h-8" /> {error}
                        </div>
                    ) : data.length === 0 ? (
                        <div className="text-center py-32 text-slate-400 font-medium animate-in zoom-in-95">
                            <div className="bg-slate-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 shadow-inner">
                                <Sparkles className="w-14 h-14 text-slate-300" />
                            </div>
                            <p className="text-2xl font-bold text-slate-600 mb-2">No data recorded yet.</p>
                            <p className="text-lg">Take some quizzes to start tracking your knowledge here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {data.map((item, idx) => {
                                const percentage = totalAttempts > 0 ? Math.round((item.count / totalAttempts) * 100) : 0;
                                const heightPercentage = maxAttempts > 0 ? (item.count / maxAttempts) * 100 : 0;

                                return (
                                    <div key={item.id} className="bg-white border-2 flex flex-col border-slate-100 p-8 rounded-3xl hover:shadow-xl hover:-translate-y-2 hover:border-indigo-100 transition-all duration-300 group overflow-hidden relative" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-0 group-hover:from-indigo-100 transition-colors"></div>

                                        <h3 className="text-2xl font-extrabold text-slate-800 mb-8 z-10 relative truncate" title={item.topic}>{item.topic}</h3>

                                        <div className="mt-auto z-10 relative space-y-6">
                                            <div className="flex items-end justify-between">
                                                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Attempts</span>
                                                <span className="text-5xl font-black text-indigo-600 group-hover:scale-110 transition-transform origin-bottom-right">{item.count}</span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                                    <span>Focus Share</span>
                                                    <span className="text-indigo-600">{percentage}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full group-hover:opacity-100 transition-all duration-1000 ease-out"
                                                        style={{ width: `${heightPercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
