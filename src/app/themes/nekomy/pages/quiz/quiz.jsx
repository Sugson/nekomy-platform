import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import BoxScore from './boxScore/boxScore';
import QuestionList from './questionList/questionList';
import Results from './results/results';
import { setLoading } from '../../../../core/actions/actions';
import Page from '../../components/page/page';

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSubject: null,
      score: 0,
      current: 1,
      quizPreviousData: null
    };

    this.setScore = this.setScore.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
  }

  componentDidMount() {
    const el = document.querySelector('.js-main');
    el.classList = '';
    el.classList.add('main', 'js-main', 'subject-page');
  }

  componentWillReceiveProps(nextProps) {
    if (isLoaded(nextProps.subject)) {
      Object.keys(nextProps.subject).map((key) => {
        this.setState({
          currentSubject: key
        });
      });

      if (nextProps.subject[this.state.currentSubject]) {
        this.setState({
          questions: nextProps.subject[this.state.currentSubject].quiz.questions
        });
      }

      if (nextProps.userData.subject) {
        this.setState({
          quizPreviousData: nextProps.userData.subject[this.state.currentSubject].quiz || null
        });
      }

      this.props.setLoading(false);
    }
  }

  setCurrent(current) {
    this.setState({ current });
  }

  setScore(score) {
    this.setState({ score });
  }

  render() {
    const { current, currentSubject, questions, quizPreviousData } = this.state;
    const { params, user, firebase } = this.props;

    return (
      <Page additionalClass={'quiz'} headline={'Quiz'}>
        { ((!_.isEmpty(this.props.subject) && currentSubject) && questions) ?
          <div>
            { current <= questions.length && !quizPreviousData ?
              <div>
                <BoxScore {...this.state} />
                <QuestionList
                  questions={questions}
                  setScore={this.setScore}
                  setCurrent={this.setCurrent}
                  {...this.state}
                />
              </div>
            :
              <Results
                user={user}
                currentSubject={currentSubject}
                setCurrent={this.setCurrent}
                setScore={this.setScore}
                subjectSlug={params.slug}
                firebase={firebase}
                quizPreviousData={quizPreviousData}
                {...this.state}
              />
            }
          </div>
        :
          <div>
            Quiz is not available now.
          </div>
        }
      </Page>
    );
  }
}

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = ({
  mainReducer: {
    isDesktop,
    userData
  }
}) => ({ isDesktop, userData });

const enhance = compose(
  firebaseConnect(props => [
    `subjects#orderByChild=slug&equalTo=${props.params.slug}`,
    'users',
    `users/${props.userID}`
  ]),
  connect(state => ({
    subject: state.firebase.data.subjects,
    users: state.firebase.data.users
  })),
  connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(Quiz);

