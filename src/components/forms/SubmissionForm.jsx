import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form, Button, FormGroup, Label, Input, ButtonGroup } from 'reactstrap';

function SubmissionForm({ questions, onSubmit }) {
  const [formData, setFormData] = useState({});


  const handleInputChange = (questionId, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [questionId]: value,
    }));
  };

  const handleSingleOptoinChange = (questionId, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [questionId]: [value]
    }))
  }

  const handleCheckboxChange = (questionId, optionId) => {
    setFormData((prevData) => {
      const options = prevData[questionId] || [];
      const newOptions = options.includes(optionId)
        ? options.filter((id) => id !== optionId)
        : [...options, optionId];
      return {
        ...prevData,
        [questionId]: newOptions,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    try {
    const submissionData = {
      answers: questions.map((question) => ({
        questionId: question.id,
        selectedOptions: Array.isArray(formData[question.id]) ? formData[question.id].map(id => ({id: id})) : [],
        text: typeof formData[question.id] === 'string' ? formData[question.id] : '',
      })),
    };

    submissionData.answers.forEach((answer) => {
      console.log('Question ID:', answer.questionId);
      console.log('Selected Options:', answer.selectedOptions);
      console.log('Text:', answer.text);
      console.log('---------------------------');
    });
    

    onSubmit(submissionData);
  } catch (error) {
    alert(error)
  }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {questions.map((question) => (
        <FormGroup key={question.id}>
          <Label for={question.id}>{question.label}</Label>
          {question.type === 'SINGLE_LINE_TEXT' && (
            <Input
              type="text"
              id={question.id}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          )}
          {question.type === 'MULTILINE_TEXT' && (
            <Input
              type="textarea"
              id={question.id}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          )}
          {question.type === 'RADIO_BUTTON' && (
            <ButtonGroup>
              {question.options.map((option) => (
                <Button
                  key={option.id}
                  color="primary"
                  outline
                  onClick={() => handleSingleOptoinChange(question.id, option.id)}
                  active={formData[question.id] === option.id}
                >
                  {option.text}
                </Button>
              ))}
            </ButtonGroup>
          )}
          {question.type === 'CHECKBOX' && (
            <ButtonGroup>
              {question.options.map((option) => (
                <Button
                  key={option.id}
                  color="primary"
                  outline
                  onClick={() => handleCheckboxChange(question.id, option.id)}
                  active={(formData[question.id] || []).includes(option.id)}
                >
                  {option.text}
                </Button>
              ))}
            </ButtonGroup>
          )}
          {question.type === 'COMBOBOX' && (
            <Input
              type="select"
              id={question.id}
              value={formData[question.id] || ''}
              onChange={(e) => handleSingleOptoinChange(question.id, parseInt(e.target.value, 10))}
            >
              <option value="">Select an option</option>
              {question.options.map((option) => (
                <option key={option.id} value={option.id}>{option.text}</option>
              ))}
            </Input>
          )}
          {question.type === 'DATE' && (
            <DatePicker
              id={question.id}
              selected={formData[question.id] || null}
              onChange={(date) => handleInputChange(question.id, date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          )}
        </FormGroup>
      ))}
      <Button type="submit" color="primary">Submit Response</Button>
    </Form>
  );
}

export default SubmissionForm;
