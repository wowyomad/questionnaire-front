import React, { useState, useEffect } from 'react';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '../services/api';
import QuestionsTable from '../components/QuestionsTable';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css'; 
import QuestionForm from '../components/forms/QuestionForm';

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

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

  const handleQuestionSubmit = async (questionData) => {
    try {
      if (selectedQuestion) {
        // Editing existing question
        await updateQuestion(selectedQuestion.id, questionData);
      } else {
        // Adding new question
        await addQuestion(questionData);
      }
      fetchQuestions();
      setIsAddingQuestion(false);
      setIsEditingQuestion(false);
    } catch (error) {
      console.error('Error:', error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  const handleAddQuestionToggle = () => {
    setIsAddingQuestion(!isAddingQuestion);
    setSelectedQuestion(null); 
  };

  const handleEditQuestionToggle = (question) => {
    setSelectedQuestion(question);
    setIsEditingQuestion(!isEditingQuestion);
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestionData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setNewQuestionData(prevData => {
      const updatedOptions = [...prevData.options];
      updatedOptions[index] = value;
      return { ...prevData, options: updatedOptions };
    });
  };

  const handleAddOption = () => {
    setNewQuestionData(prevData => ({
      ...prevData,
      options: [...prevData.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    setNewQuestionData(prevData => {
      const updatedOptions = [...prevData.options];
      updatedOptions.splice(index, 1);
      return { ...prevData, options: updatedOptions };
    });
  };

  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await addQuestion(newQuestionData);
      if (success) {
        fetchQuestions();
        setIsAddingQuestion(false);
        setNewQuestionData({
          label: '',
          type: 'SINGLE_LINE_TEXT',
          options: []
        });
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleEditQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await updateQuestion(selectedQuestion.id, newQuestionData);
      if (success) {
        fetchQuestions();
        setIsEditingQuestion(false);
        setNewQuestionData({
          label: '',
          type: 'SINGLE_LINE_TEXT',
          options: []
        });
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const success = await deleteQuestion(questionId);
        if (success) {
          fetchQuestions();
        }
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setNewQuestionData({
      label: question.label,
      type: question.type,
      options: question.options.map(option => ({
        id: option.id,
        text: option.text
      }))
    });
    handleEditQuestionToggle();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Fields</h2>
      <Button color="primary" onClick={handleAddQuestionToggle}>Add Question</Button>

      {/* Modals for Add and Edit */}
      <Modal isOpen={isAddingQuestion || isEditingQuestion} toggle={() => (isAddingQuestion ? handleAddQuestionToggle() : handleEditQuestionToggle(null))}>
        <ModalHeader toggle={() => (isAddingQuestion ? handleAddQuestionToggle() : handleEditQuestionToggle(null))}>
          {isAddingQuestion ? "Add New Question" : "Edit Question"}
        </ModalHeader>
        <ModalBody>
          <QuestionForm 
            question={isEditingQuestion ? selectedQuestion : null} 
            onSubmit={handleQuestionSubmit}
          /> 
        </ModalBody>
      </Modal>

      <hr />
      <QuestionsTable
        questions={questions}
        onEdit={handleEditQuestionToggle}
        onDelete={handleDeleteQuestion}
      />
    </div>
  );
}


export default QuestionsPage;