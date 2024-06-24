import React, { useState, useEffect } from 'react';
import { getSubmissions, deleteSubmission } from '../services/api';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap'; // Import Table
import { getQuestions } from '../services/api'; 

function ResponsesPage() {
    const [submissions, setSubmissions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isDeletingSubmission, setIsDeletingSubmission] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  
    useEffect(() => {
      fetchSubmissions();
      fetchQuestions();
    }, []);
  
    const fetchSubmissions = async () => {
      try {
        const data = await getSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };
  
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  
    const handleDeleteSubmissionToggle = () => {
      setIsDeletingSubmission(!isDeletingSubmission);
    };
  
    const handleDeleteSubmission = async () => {
      if (true || window.confirm('Are you sure you want to delete this submission?')) {
        try {
          const success = await deleteSubmission(selectedSubmissionId);
          if (success) {
            fetchSubmissions();
            setIsDeletingSubmission(false);
          }
        } catch (error) {
          console.error('Error deleting submission:', error);
        }
      }
    };
  
    const handleSelectSubmission = (submissionId) => {
      setSelectedSubmissionId(submissionId);
      handleDeleteSubmissionToggle();
    };
  
    const getQuestionById = (questionId) => {
      return questions.find(q => q.id === questionId);
    };
  
    return (
      <div className="container mt-4">
        <h2 className="mb-4">Responses Viewer</h2>
        <Table striped responsive>
          <thead>
            <tr>
              <th>Submission Time</th>
              {questions.map(question => (
                <th key={question.id}>{question.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission.id}>
                <td>
                  {new Date(
                    submission.submissionTime[0],
                    submission.submissionTime[1] - 1,
                    submission.submissionTime[2],
                    submission.submissionTime[3],
                    submission.submissionTime[4],
                    submission.submissionTime[5],
                    submission.submissionTime[6]
                  ).toLocaleString()}
                </td>
                {questions.map(question => {
                  const answer = submission.answers.find(a => a.questionId === question.id);
                  return (
                    <td key={question.id}>
                      {answer ? (
                        answer.selectedOptions.length > 0 ? (
                          <ul>
                            {answer.selectedOptions.map(selectedOptionId => {
                              const optionText = getQuestionById(question.id)?.options.find(o => o.id === selectedOptionId);
                              return <li key={selectedOptionId}>{optionText?.text}</li>;
                            })}
                          </ul>
                        ) : answer.text ? (
                          answer.text
                        ) : (
                          'N/A'
                        )
                      ) : (
                        'N/A'
                      )}
                    </td>
                  );
                })}
                <td>
                  <Button color="danger" onClick={() => handleSelectSubmission(submission.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal isOpen={isDeletingSubmission} toggle={handleDeleteSubmissionToggle}>
          <ModalHeader toggle={handleDeleteSubmissionToggle}>Delete Submission</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this submission?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleDeleteSubmission}>Delete</Button>
            <Button color="secondary" onClick={handleDeleteSubmissionToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

export default ResponsesPage;