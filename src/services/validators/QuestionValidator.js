export const validateSubmissionRequest = (submissionData) => {
    answers = submissionData.answers;
    if(answers) {
        if (Array.isArray(answers)) {
            answers.forEach((answer) => {

            })
        } else {
            return false;
        }
       return false;
    }
}