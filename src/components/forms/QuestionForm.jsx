import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';

const questionTypes = [
  'SINGLE_LINE_TEXT',
  'MULTILINE_TEXT',
  'RADIO_BUTTON',
  'CHECKBOX',
  'COMBOBOX',
  'DATE',
];

function QuestionForm({ onSubmit, question }) {
  const [questionData, setQuestionData] = useState({
    label: '',
    text: '',
    type: 'SINGLE_LINE_TEXT',
    options: [],
    isRequired: false, 
    isActive: true,   
  });

  useEffect(() => {
    if (question) {
      setQuestionData({
        label: question.label,
        type: question.type,
        text: question.text,
        options: question.options.map(option => ({
          id: option.id,
          text: option.text,
          isRequired: option.isRequired || false, // Load isRequired if exists
          isActive: option.isActive || true,    // Load isActive if exists
        }))
      });
    }
  }, [question]);

  const handleIsRequiredChange = () => {
    setQuestionData(prevData => ({ ...prevData, isRequired: !prevData.isRequired }));
  };

  const handleIsActiveChange = () => {
    setQuestionData(prevData => ({ ...prevData, isActive: !prevData.isActive }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setQuestionData(prevData => {
      const updatedOptions = [...prevData.options];
      updatedOptions[index] = value;
      return { ...prevData, options: updatedOptions };
    });
  };

  const handleAddOption = () => {
    setQuestionData(prevData => ({
      ...prevData,
      options: [...prevData.options, { text: 'Option' }]
    }));
  };

  const handleRemoveOption = (index) => {
    setQuestionData(prevData => {
      const updatedOptions = [...prevData.options];
      updatedOptions.splice(index, 1);
      return { ...prevData, options: updatedOptions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(questionData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="label">Label:</Label>
        <Input
          type="text"
          name="label"
          id="label"
          value={questionData.label}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
      <Label for="label">Description</Label>
      <Input
      type = "textarea"
      name = "text"
      id = "text"
      value = {questionData.text}
      onChange={handleChange}
      />

      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" checked={questionData.isRequired} onChange={handleIsRequiredChange} />{' '}
          Is Required
        </Label>
      </FormGroup>

      <FormGroup check>
        <Label check>
          <Input type="checkbox" checked={questionData.isActive} onChange={handleIsActiveChange} />{' '}
          Is Active
        </Label>
      </FormGroup>
      <FormGroup>
        <Label for="type">Question Type:</Label>
        <Input type="select" name="type" id="type" value={questionData.type} onChange={handleChange}>
          <option value="SINGLE_LINE_TEXT">SINGLE LINE TEXT</option>
          <option value="MULTILINE_TEXT">MULTILINE TEXT</option>
          <option value="RADIO_BUTTON">RADIO BUTTON</option>
          <option value="CHECKBOX">CHECKBOX</option>
          <option value="COMBOBOX">COMBOBOX</option>
          <option value="DATE">DATE</option>
        </Input>
      </FormGroup>
      {['RADIO_BUTTON', 'CHECKBOX', 'COMBOBOX'].includes(questionData.type) && (
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
              {questionData.options.map((option, index) => (
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
      <Button type="submit" color="primary">{question ? 'Update' : 'Save'}</Button>
    </Form>
  );
}

export default QuestionForm;