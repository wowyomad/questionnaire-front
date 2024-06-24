import React, { useState, useEffect } from 'react';

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
    type: 'SINGLE_LINE_TEXT',
    options: []
  });

  useEffect(() => {
    if (question) {
      setQuestionData({
        label: question.label,
        type: question.type,
        options: question.options.map(option => ({
          id: option.id,
          text: option.text
        }))
      });
    }
  }, [question]);

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
      options: [...prevData.options, { id: Date.now(), text: '' }]
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
        <Label for="label">Question Label:</Label>
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