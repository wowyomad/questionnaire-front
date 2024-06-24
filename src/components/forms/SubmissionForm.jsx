import moment from 'moment';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form, Button, FormGroup, Label, Input, ButtonGroup } from 'reactstrap';

function SubmissionForm({ questions, onSubmit }) {
  const [formData, setFormData] = useState({});


  const handleInputChange = (questionId, value) => {
    console.log(`handleInutChange: questionId ${questionId}, value ${value}`)

    setFormData((prevData) => ({
      ...prevData,
      [questionId]: value,
    }));
  };

  const handleSingleOptoinChange = (questionId, value) => {
    console.log(`handleSingleOption: questionId ${questionId}, value ${value}`)
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
    try {
      const filteredQuestions = questions.filter((question) => {
        const answer = formData[question.id];
        return typeof answer === 'string' || (Array.isArray(answer) && answer.length > 0);
      });

      const submissionData = {
        answers: filteredQuestions.map((question) => {
          const answer = formData[question.id];
          return {
            questionId: question.id,
            selectedOptions: Array.isArray(answer) ? answer.map((id) => ({ id })) : [],
            text: typeof answer === 'string' ? answer : '',
          };
        }),
      };

      submissionData.answers.forEach((answer) => {
        console.log('Question ID:', answer.questionId);
        console.log('Selected Options:', answer.selectedOptions);
        console.log('Text:', answer.text);
        console.log('---------------------------');
      });

      onSubmit(submissionData); // Assuming onSubmit is an async function

    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error);
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
              selected={isValidDate(formData[question.id]) ? moment(formData[question.id], "dd-MM-yyyy").toDate() : null}
              onChange={(date) => handleInputChange(question.id, moment(date).format('dd-MM-yyyy'))}
              dateFormat="dd-MM-yyyy"
              className="form-control"
            />
          )}
        </FormGroup>
      ))}
      <Button type="submit" color="primary">Submit Response</Button>
    </Form>
  );
}

function isValidDate(dateString) {
  return moment(dateString, "dd-MM-yyyy", true).isValid(); // Strict parsing
}

export default SubmissionForm;
