import React, { useState, useEffect } from 'react';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '../services/api';
import QuestionsTable from '../components/QuestionsTable';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css'; 

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newQuestionData, setNewQuestionData] = useState({
    label: '',
    type: 'SINGLE_LINE_TEXT',
    options: []
  });

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

  const handleAddQuestionToggle = () => {
    setIsAddingQuestion(!isAddingQuestion);
  };

  const handleEditQuestionToggle = () => {
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
      <h2 className="mb-4">Question Manager</h2>
      <Button color="primary" onClick={handleAddQuestionToggle}>Add Question</Button>
      <Modal isOpen={isAddingQuestion} toggle={handleAddQuestionToggle}>
        <ModalHeader toggle={handleAddQuestionToggle}>Add New Question</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddQuestionSubmit}>
            <FormGroup>
              <Label for="label">Question Label:</Label>
              <Input
                type="text"
                name="label"
                id="label"
                value={newQuestionData.label}
                onChange={handleQuestionChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="type">Question Type:</Label>
              <Input type="select" name="type" id="type" value={newQuestionData.type} onChange={handleQuestionChange}>
                <option value="SINGLE_LINE_TEXT">SINGLE LINE TEXT</option>
                <option value="MULTILINE_TEXT">MULTILINE TEXT</option>
                <option value="RADIO_BUTTON">RADIO BUTTON</option>
                <option value="CHECKBOX">CHECKBOX</option>
                <option value="COMBOBOX">COMBOBOX</option>
                <option value="DATE">DATE</option>
              </Input>
            </FormGroup>
            {['RADIO_BUTTON', 'CHECKBOX', 'COMBOBOX'].includes(newQuestionData.type) && (
              <FormGroup>
                <Label for="options">Options:</Label>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Text</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newQuestionData.options.map((option, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          <Input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, { ...option, text: e.target.value })}
                          />
                        </td>
                        <td>
                          <Button color="danger" onClick={() => handleRemoveOption(index)}>Remove</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button color="secondary" onClick={handleAddOption}>Add Option</Button>
              </FormGroup>
            )}
            <ModalFooter>
              <Button type="submit" color="primary">Save</Button>
              <Button color="secondary" onClick={handleAddQuestionToggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={isEditingQuestion} toggle={handleEditQuestionToggle}>
        <ModalHeader toggle={handleEditQuestionToggle}>Edit Question</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditQuestionSubmit}>
            <FormGroup>
              <Label for="label">Question Label:</Label>
              <Input
                type="text"
                name="label"
                id="label"
                value={newQuestionData.label}
                onChange={handleQuestionChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="type">Question Type:</Label>
              <Input type="select" name="type" id="type" value={newQuestionData.type} onChange={handleQuestionChange}>
                <option value="SINGLE_LINE_TEXT">SINGLE LINE TEXT</option>
                <option value="MULTILINE_TEXT">MULTILINE TEXT</option>
                <option value="RADIO_BUTTON">RADIO BUTTON</option>
                <option value="CHECKBOX">CHECKBOX</option>
                <option value="COMBOBOX">COMBOBOX</option>
                <option value="DATE">DATE</option>
              </Input>
            </FormGroup>
            {['RADIO_BUTTON', 'CHECKBOX', 'COMBOBOX'].includes(newQuestionData.type) && (
              <FormGroup>
                <Label for="options">Options:</Label>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Text</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newQuestionData.options.map((option, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          <Input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, { ...option, text: e.target.value })}
                          />
                        </td>
                        <td>
                          <Button color="danger" onClick={() => handleRemoveOption(index)}>Remove</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button color="secondary" onClick={handleAddOption}>Add Option</Button>
              </FormGroup>
            )}
            <ModalFooter>
              <Button type="submit" color="primary">Save</Button>
              <Button color="secondary" onClick={handleEditQuestionToggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
      <hr />
      <QuestionsTable
        questions={questions}
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
      />
    </div>
  );
}

export default QuestionsPage;