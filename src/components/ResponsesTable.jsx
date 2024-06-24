import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';

function ResponsesTable({ submissions, questions, onDelete }) {
  const getQuestionById = (questionId) => {
    return questions.find((q) => q.id === questionId);
  };

  const mapTo = (answer) => {
    if (answer?.selectedOptions?.length > 0) {
      return (
        <ul style={{ columns: '2' }}>
          {answer.selectedOptions.map((option, index) => (
            <li key={index}>
              {option.text.split(' ').map((word, wordIndex) => (
                <span key={wordIndex}>{word} </span> 
              ))}
            </li>
          ))}
        </ul>
      );
    }
  
    if (answer?.text?.length > 0) {
      return <ul>{answer.text}</ul>;
    }
  
    return <ul>N/A</ul>;
  };

  return (
    <Table striped responsive>
      <thead>
        <tr>
          <th>Submission Time</th>
          {questions.map((question) => (
            <th key={question.id}>{question.label}</th> 
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <tr key={submission.id}>
            <td>{submission.submissionTime}</td>
            {questions.map((question) => {
              const answer = submission.answers.find(
                (a) => a.questionId === question.id
              );
              return (
                <td key={question.id}> 
                {mapTo(answer)}
                
                </td>
              );
            })}
            <td>
              <Button color="danger" onClick={() => onDelete(submission.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ResponsesTable;