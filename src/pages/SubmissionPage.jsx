import React, { useState, useEffect } from 'react';
import { getQuestions, submitResponse } from '../services/api';
import SubmissionForm from '../components/forms/SubmissionForm';

function SubmissionPage() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSubmit = async (submissionData) => {
    try {
      const success = await submitResponse(submissionData);
      if (success) {
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Submission Form</h2>
      {questions.length > 0 && (
        <SubmissionForm questions={questions} onSubmit={handleSubmit} />
      )}
    </div>
  );
}

export default SubmissionPage;