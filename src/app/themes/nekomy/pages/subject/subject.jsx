import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { Link } from 'react-router';
import { setLoading } from '../../../../core/actions/actions';

class Subject extends Component {

  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'subject-page');
  }

  render() {
    let subject = null;
    const section = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);

    if (isLoaded(this.props.subject) && !isEmpty(this.props.subject)) {
      subject = Object.keys(this.props.subject)
        .map(key => this.props.subject[key])
        .reduce((result, filter) => filter, {});
    }

    return subject ? (
      <section className="page subject">
        <div className="page-wrapper">
          <h1 className="title">
            {subject.title}
          </h1>
          { subject.forum &&
            <Link to={`/subjects/${subject.slug}/forum`}>Disussion</Link>
          }
          <Link to={`/subjects/${subject.slug}/homework`}>Homework</Link>
          <Link to={`/subjects/${subject.slug}/quiz`}>Quiz</Link>
        </div>
      </section>
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
