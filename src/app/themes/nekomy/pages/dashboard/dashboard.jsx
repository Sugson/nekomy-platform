import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router';
import ReactShow from 'react-show';
import Calendar from 'react-calendar/dist/entry.nostyle';
import { setLoading } from '../../../../core/actions/actions';
import Icon from '../../../../core/common/lib/icon/icon';
import Teacher from '../../../../../../static/svg/professor.svg';
import Cog from '../../../../../../static/svg/cog.svg';
import avatarPlaceholder from '../../../../../../static/img/placeholder-avatar.png';
import Page from '../../components/page/page';

const defaultProps = {
  colors: [
    '#2ecc71',
    '#e8303f',
    '#122d59',
    '#448cd3',
    '#445f8c',
    '#ffdd00',
    '#f0ad4e',
    '#a83fd0'
  ]
};

const propTypes = {
  colors: PropTypes.array
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subjectsVisible: false
    };

    this.renderCourses = this.renderCourses.bind(this);
    this.renderCourseSubjects = this.renderCourseSubjects.bind(this);
  }

  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'dashboard-page');
  }

  renderCourses() {
    const { subjectsVisible } = this.state;
    const { users, user, courses } = this.props;
    const { courses: userCourses } = users[user.uid] || [];
    const coursesList = [];

    if (courses && userCourses) {
      Object.keys(userCourses).forEach((courseKey) => {
        if (courses[courseKey]) {
          coursesList.push(courses[courseKey]);
        }
      });
    }

    return coursesList.map(course => (
      <div className={'dashboard__course-card'} key={course.code}>
        <Link to={`/courses/${course.slug}`}>
          {course.title}
        </Link>
        <span className={'date'}>ends on {course.endDate}</span>
        <ReactShow style={{ position: 'relative' }} show={subjectsVisible}>
          <ul className="items-list sub-items-list">
            { this.renderCourseSubjects(course.subjects) }
          </ul>
        </ReactShow>
        <button onClick={() => this.setState({ subjectsVisible: !subjectsVisible })} className={'btn btn-xs btn-primary'}>
          { subjectsVisible ? 'Hide subjects' : 'Show subjects' }
        </button>
      </div>
    ));
  }

  renderCourseSubjects(subjectIDs) {
    const { subjects } = this.props;
    const subjectsList = [];

    if (subjects && subjectIDs) {
      subjectIDs.forEach((subjectKey) => {
        if (subjects[subjectKey]) {
          subjectsList.push(subjects[subjectKey]);
        }
      });
    }

    return subjectsList.map(subject => (
      <li
        key={subject.code}
        className="subject-item"
      >
        { subject.status !== 'active' ?
          <div>{ subject.shortTitle }</div>
        :
          <Link to={`/subjects/${subject.slug}`}>
            { subject.shortTitle }
          </Link>
        }
        { subject.teachers && this.renderTeachers(subject.teachers) }
      </li>
    ));
  }

  renderTeachers(teachers) {
    const { users } = this.props;
    const teachersList = [];

    if (users && teachers) {
      teachers.forEach((teacherKey) => {
        if (users[teacherKey]) {
          const { displayName } = users[teacherKey].info;
          teachersList.push(displayName);
        }
      });
    }

    return (
      <div className="teachers">
        <Icon glyph={Teacher} />
        { teachersList.map(teacher => (teacher)) }
      </div>
    );
  }

  render() {
    const { courses, users, subjects, userData } = this.props;
    const { info } = userData;
    const today = new Date();

    return (
      <Page additionalClass={'dashboard'}>
        <div className="row start dashboard__user-row">
          <div className="col-xs-12 col-sm-4">
            { !_.isEmpty(userData) ?
              <div className={'dashboard__user-card'}>
                <img alt={'Profile card'} className={'photo'} role={'presentation'} src={avatarPlaceholder} />
                <p className="name">{info.displayName}</p>
                <p className="email">{info.email}</p>
                <div className={'settings'}>
                  <Link to={'/account'}>
                    <Icon glyph={Cog} />
                  </Link>
                </div>
              </div>
            :
              <div className={'loader-small__container'}>
                <div className="loader-small" />
              </div>
            }
          </div>
          <div className="col-xs-12 col-sm-4">
            <div className={'dashboard__calendar'}>
              <div className="row no-padding">
                <div className="col-xs-12 col-sm-6">
                  <div className={'dashboard__calendar-card'}>
                    <div>
                      <span className="day">{today.getDate()}</span>&nbsp;
                    </div>
                    <p className={'weekday'}>{today.toLocaleString('en-us', { weekday: 'long' })}</p>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6">
                  <Calendar
                    className={'dashboard__calendar-full'}
                    formatShortWeekday={() => ''}
                    value={new Date()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h1 className="dashboard__title">Current courses</h1>
            { isLoaded(subjects) && isLoaded(users) && isLoaded(courses) ?
              <ul className={'dashboard__courses'}>
                { this.renderCourses() }
              </ul>
            :
              <div className={'loader-small__container'}>
                <div className="loader-small" />
              </div>
            }
          </div>
        </div>
      </Page>
    );
  }
}

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = ({
  mainReducer: {
    isDesktop,
    userData
  }
}) => ({ isDesktop, userData });

export default compose(
  firebaseConnect(['courses', 'subjects', 'users']),
  connect(state => ({
    courses: state.firebase.data.courses,
    subjects: state.firebase.data.subjects,
    users: state.firebase.data.users
  })),
  connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
