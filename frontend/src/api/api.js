import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const askQuestion = (question) => {
    return api.post('/ask', null, { params: { question } });
};

export const generateQuiz = (topic) => {
    return api.post('/generate_quiz', null, { params: { topic } });
};

export const submitQuiz = (topic, question, student_answer) => {
    return api.post('/submit_quiz', null, { params: { topic, question, student_answer } });
};

export const getAnalytics = () => {
    return api.get('/analytics');
};

export default api;
