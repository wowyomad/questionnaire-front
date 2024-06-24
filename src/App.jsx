import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import QuestionsPage from './pages/QuestionsPage';
import ResponsesPage from './pages/ResponsesPage';
import SubmissionPage from './pages/SubmissionPage';
import { useState } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState('submission');

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div>
      <div>
        <button onClick={() => handlePageChange('submission')}>Submission</button>
        <button onClick={() => handlePageChange('questions')}>Questions</button>
        <button onClick={() => handlePageChange('responses')}>Responses</button>
      </div>
      {activePage === 'submission' && <SubmissionPage />}
      {activePage === 'questions' && <QuestionsPage />}
      {activePage === 'responses' && <ResponsesPage />}
    </div>
  );
}