import React from 'react';
import Question from '../question/question';

class QuestionList extends React.Component {
  render() {
    return (
      <div className="quesitons">
        {
          this.props.questions.map((question, index) => {
            if (this.props.current === index + 1) {
              return <Question question={question} {...this.props} key={index} />
            }
          })
        }
      </div>
    );
  }
}

export default QuestionList;
