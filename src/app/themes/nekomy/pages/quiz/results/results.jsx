import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { Progress } from 'react-sweet-progress';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.handleTryAgain = this.handleTryAgain.bind(this);
  }

  componentDidMount() {
    const { score, questions, currentSubject, user, firebase } = this.props;
    const percent = (score / questions.length) * 100;
    const isQuizPassed = percent > 50;

    if (percent) {
      firebase.push(`users/${user.uid}/subject/${currentSubject}/quiz`, {
        percent,
        score,
        isQuizPassed,
        timestamp: Date.now()
      })
        .then(() => {}, (error) => {
          this.props.setNotification({ message: String(error), type: 'error' });
        });
    }
  }

  handleTryAgain() {
    const { setCurrent, setScore, firebase, currentSubject, user } = this.props;

    setScore(0);
    setCurrent(1);

    firebase.set(`users/${user.uid}/subject/${currentSubject}/quiz`, {})
      .then(() => {}, (error) => {
        this.props.setNotification({ message: String(error), type: 'error' });
      });
  }

  render() {
    const { score, questions, quizPreviousData } = this.props;
    const previousData = _.flatMap(quizPreviousData)[0];
    const percent = previousData ? previousData.percent : (score / questions.length) * 100;
    const isQuizPassed = percent > 50;

    return (
      <div className={'results'}>
        <h2>Results</h2>
        <div className={'results__summary'}>
          {`You've got ${previousData ? previousData.score : score} out of ${questions.length} (${percent.toPrecision(3)}%)`}
        </div>
        <div className={'results__bar'}>
          <Progress
            status={percent > 50 ? 'success' : 'error'}
            type={'circle'}
            percent={percent}
          />
          { isQuizPassed ?
            <h5 className={'results__pass'}>QUIZ PASSED</h5>
          :
            <h5 className={'results__fail'}>QUIZ FAILED</h5>
          }
        </div>
        { isQuizPassed ?
          <div>
            <div className={'results__description'}>Congratulations! You passed quiz, nice job!</div>
            <Link to={`/subjects/${this.props.subjectSlug}`}>
              <div className="btn btn-primary">Go back to course</div>
            </Link>
          </div>
          :
          <div>
            <div className={'results__description'}>You have to answer half of the questions correctly to pass quiz.</div>
            <a className="btn btn-primary" onClick={() => this.handleTryAgain()}>Try again</a>
          </div>
        }
      </div>
    );
  }
}

export default Results;
