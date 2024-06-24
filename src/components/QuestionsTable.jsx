import React from 'react';
import { Button, Table } from 'reactstrap';

function QuestionsTable({ questions, onEdit, onDelete }) {
    return (
      <Table striped>
        <thead>
          <tr>
            <th>Label</th>
            <th>Type</th>
            <th>Options</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(question => (
            <tr key={question.id}>
              <td>{question.label}</td>
              <td>{question.type.replace('_', ' ')}</td>
              <td>
                {question.options.length > 0 ? (
                  <ul>
                    {question.options.map(option => (
                      <li key={option.id}>{option.text}</li>
                    ))}
                  </ul>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <Button color="warning" onClick={() => onEdit(question)}>Edit</Button>
                <Button color="danger" onClick={() => onDelete(question.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  

export default QuestionsTable;