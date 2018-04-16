import React from 'react';
import { Progress } from 'react-sweet-progress';

class BoxScore extends React.Component {
  render() {
    const { current, questions } = this.props;
    const progress = ((current - 1) / questions.length) * 100;

    return (
      <div className={'progress'}>
        <div className={'progress__summary'}>
          {`Question ${current} of ${questions.length}`}
        </div>
        <Progress percent={progress} />
      </div>
    );
  }
}

export default BoxScore;
