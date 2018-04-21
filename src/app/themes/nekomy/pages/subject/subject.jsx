import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { Link } from 'react-router';
import { setLoading } from '../../../../core/actions/actions';
import Icon from '../../../../core/common/lib/icon/icon';
import Chat from '../../../../../../static/svg/chat3.svg';
import Quiz from '../../../../../../static/svg/exam.svg';
import Home from '../../../../../../static/svg/plan.svg';
import Literature from '../../../../../../static/svg/catalogue.svg';
import Presentation from '../../../../../../static/svg/presentation.svg';
import Page from '../../components/page/page';

class Subject extends Component {

  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'subject-page');
  }

  render() {
    let subject = null;

    if (isLoaded(this.props.subject) && !isEmpty(this.props.subject)) {
      subject = Object.keys(this.props.subject)
        .map(key => this.props.subject[key])
        .reduce((result, filter) => filter, {});
    }

    return subject ? (
      <Page additionalClass={'subject'} headline={subject.title}>
        <div className="row start">
          <div className="col-xs-12 col-sm-4">
            <Link to={`/subjects/${subject.slug}/lesson`}>
              <div className={'box subject__card'}>
                <Icon glyph={Presentation} />
                <p>Lesson</p>
              </div>
            </Link>
          </div>
          <div className="col-xs-12 col-sm-4">
            <Link to={`/subjects/${subject.slug}/forum`}>
              <div className={'box subject__card'}>
                <Icon glyph={Chat} />
                <p>Disussion</p>
              </div>
            </Link>
          </div>
          <div className="col-xs-12 col-sm-4">
            <Link to={`/subjects/${subject.slug}/homework`}>
              <div className={'box subject__card'}>
                <Icon glyph={Home} />
                <p>Homework</p>
              </div>
            </Link>
          </div>
          <div className="col-xs-12 col-sm-4">
            <Link to={`/subjects/${subject.slug}/literature`}>
              <div className={'box subject__card'}>
                <Icon glyph={Literature} />
                <p>Literature</p>
              </div>
            </Link>
          </div>
          <div className="col-xs-12 col-sm-4">
            <Link to={`/subjects/${subject.slug}/quiz`}>
              <div className={'box subject__card'}>
                <Icon glyph={Quiz} />
                <p>Quiz</p>
              </div>
            </Link>
          </div>
        </div>
      </Page>
    ) : <div className="loader-small" />;
  }
}

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = ({
  mainReducer: {
    isDesktop,
    userData,
    userID
  }
}) => ({ isDesktop, userData, userID });

const enhance = compose(
  firebaseConnect(props => [
    `subjects#orderByChild=slug&equalTo=${props.params.slug}`,
    'files',
    'users',
    'activities',
    'modules',
    `users/${props.userID}`
  ]),
  connect(state => ({
    subject: state.firebase.data.subjects,
    files: state.firebase.data.files,
    users: state.firebase.data.users,
    activities: state.firebase.data.activities,
    modules: state.firebase.data.modules
  })),
  connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(Subject);
