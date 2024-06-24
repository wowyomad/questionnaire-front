import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Replace with your API base URL

// Questions API
export const getQuestions = async () => {
  const response = await axios.get(`${API_BASE_URL}/questions`);
  console.log('GET /questions Response:', response.data);
  return response.data;
};

export const addQuestion = async (questionData) => {
  try {
    console.log('POST /questions Request:', questionData);
    const response = await axios.post(`${API_BASE_URL}/questions`, questionData);
    console.log('POST /questions Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

export const updateQuestion = async (questionId, questionData) => {
  try {
    console.log('PUT /questions Request:', questionData);
    const response = await axios.put(`${API_BASE_URL}/questions/${questionId}`, questionData);
    console.log('PUT /questions Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    console.log('DELETE /questions Request: ID', questionId);
    const response = await axios.delete(`${API_BASE_URL}/questions/${questionId}`);
    console.log('DELETE /questions Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// Submissions API

export const getSubmissions = async () => {
  const response = await axios.get(`${API_BASE_URL}/submissions`);
  console.log('GET /submissions Response:', response.data); 
  return response.data;
};

export const submitResponse = async (formData) => {
  try {
    console.log('POST /submissions Request:', formData);
    const response = await axios.post(`${API_BASE_URL}/submissions`, formData);
    console.log('POST /submissions Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error submitting response:', error);
    throw error; 
  }
};

export const deleteSubmission = async (submissionId) => {
  try {
    console.log('DELETE /submissions Request: ID', submissionId);
    const response = await axios.delete(`${API_BASE_URL}/submissions/${submissionId}`);
    console.log('DELETE /submissions Response:', response);
    return response.data; 
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error; 
  }
};