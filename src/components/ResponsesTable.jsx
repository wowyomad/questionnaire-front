import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';

function ResponsesTable({ submissions, questions, onDelete }) {
  const getQuestionById = (questionId) => {
    return questions.find((q) => q.id === questionId);
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
            <td>
              {new Date(
                submission.submissionTime[0],
                submission.submissionTime[1] - 1, 
                submission.submissionTime[2],
                submission.submissionTime[3],
                submission.submissionTime[4],
                submission.submissionTime[5]
              ).toLocaleString()}
            </td>
            {questions.map((question) => {
              const answer = submission.answers.find(
                (a) => a.questionId === question.id
              );
              return (
                <td key={question.id}> 
                  {answer ? (
                    answer.selectedOptions.length > 0 ? (
                      <ul>
                        {answer.selectedOptions.map((optionId) => { 
                          const optionText = getQuestionById(question.id)?.options.find(
                            (o) => o.id === optionId 
                          );
                          return <li key={optionId}>{optionText?.text}</li>; 
                        })}
                      </ul>
                    ) : answer.text
                      ? answer.text
                      : 'N/A'
                  ) : (
                    'N/A' 
                  )}
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