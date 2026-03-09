import React, { useState } from 'react';
import { uploadFile } from '../api/api';
import { FileUp, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [chunks, setChunks] = useState(0);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setSuccessMsg('');
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setSuccessMsg('');
        setError('');

        try {
            const res = await uploadFile(file);
            setSuccessMsg(res.data.message || 'File uploaded successfully!');
            if (res.data.chunks !== undefined) {
                setChunks(res.data.chunks);
            } else if (res.data.chunks === undefined && Array.isArray(res.data.chunks)) {
                setChunks(res.data.chunks.length);
            } else if (typeof res.data.chunks === 'number') {
                setChunks(res.data.chunks);
            } else if (Array.isArray(res.data.chunks)) {
                setChunks(res.data.chunks.length);
            }
        } catch (err) {
            setError('An error occurred during upload. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 max-w-4xl mx-auto w-full flex-1 flex flex-col animate-in fade-in">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">Upload Study Material</h1>
                <p className="text-slate-500 max-w-lg mx-auto text-lg">Upload your PDF documents and study materials here so the AI can analyze them and provide intelligent tutoring.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                <div
                    className={clsx(
                        "w-full max-w-xl p-14 border-2 border-dashed rounded-2xl mb-8 flex flex-col items-center justify-center transition-all duration-300",
                        file ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
                    )}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                    <FileUp className={clsx("w-16 h-16 mb-5 transition-transform duration-300", file ? "text-indigo-600 scale-110" : "text-slate-400")} />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-indigo-600 font-bold text-xl hover:text-indigo-800 mb-2"
                    >
                        Choose a PDF file
                    </label>
                    <p className="text-sm text-slate-500">
                        {file ? <span className="text-indigo-800 font-extrabold bg-indigo-100 px-3 py-1 rounded-full">{file.name}</span> : "or click here to browse"}
                    </p>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:cursor-not-allowed text-lg"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileUp className="w-6 h-6" />}
                    {loading ? 'Processing Document...' : 'Upload & Analyze Material'}
                </button>

                {error && (
                    <div className="mt-8 flex items-center gap-3 bg-red-50 text-red-700 p-5 rounded-xl w-full max-w-xl border border-red-200">
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {successMsg && (
                    <div className="mt-8 flex items-start gap-4 bg-emerald-50 text-emerald-900 p-6 rounded-xl w-full max-w-xl border border-emerald-200 shadow-sm animate-in zoom-in-95">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-extrabold text-xl mb-1">{successMsg}</p>
                            {chunks !== undefined && (
                                <p className="text-emerald-700/80 font-medium">Successfully processed into <span className="font-black text-emerald-800 text-lg px-2 bg-emerald-100 rounded-md mx-1">{chunks}</span> knowledge chunks.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPage;
