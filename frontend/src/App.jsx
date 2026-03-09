import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import UploadPage from './pages/UploadPage';
import TutorPage from './pages/TutorPage';
import QuizPage from './pages/QuizPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden flex flex-col h-screen">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/tutor" element={<TutorPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
