import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { Link } from 'react-router';
import moment from 'moment';
import { setLoading } from '../../../../core/actions/actions';
import Icon from '../../../../core/common/lib/icon/icon';
import Announcement from '../../../../../../static/svg/announcement.svg';
import Download from '../../../../../../static/svg/download.svg';
import Upload from '../../../../../../static/svg/upload.svg';
import Teacher from '../../../../../../static/svg/professor.svg';
import Chat from '../../../../../../static/svg/chat.svg';

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
      <div key={course.code}>
        <li
          className="item"
          style={{
            borderLeftColor: this.props.colors[2]
          }}
        >
          <Link to={`/courses/${course.slug}`}>
            {course.title}
          </Link>
          <br /><span>ends on {course.endDate}</span>
        </li>
        <ul className="items-list sub-items-list">
          { this.renderCourseSubjects(course.subjects) }
        </ul>
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
        className="item"
        style={{
          borderLeftColor: this.props.colors[7]
        }}
      >
        <Link to={`/subjects/${subject.slug}`}>
          { subject.title }
        </Link>
        <br />
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
          const { firstName, lastName1, lastName2 } = users[teacherKey].info;
          teachersList.push(`${firstName} ${lastName1} ${lastName2}`);
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
    let subjects = null;
    const activities = [];

    if (isLoaded(this.props.subjects) && !isEmpty(this.props.subjects) &&
    isLoaded(this.props.activities) && !isEmpty(this.props.activities) &&
    isLoaded(this.props.users) && !isEmpty(this.props.users)) {
      subjects = Object.keys(this.props.users[this.props.user.uid].courses).map((key) => {
        const course = this.props.users[this.props.user.uid].courses[key];

        return Object.keys(course).map((subject, c) => {
          let teachers = '';

          if (this.props.subjects[subject].activities) {
            const newActivities = this.props.subjects[subject].activities.map(activity => (
              <li
                key={activity}
                className="item"
                style={{
                  borderLeftColor: this.props.colors[c]
                }}
              >
                <Link to={`/activities/${this.props.activities[activity].slug}`}>{this.props.activities[activity].title}</Link>
                <div className="meta">
                  Due in
                  <span className="date">{moment(this.props.activities[activity].endDate).format('D MMMM YYYY')}</span>
                </div>
                <div className="actions">
                  <Link to="/dashboard#demo-not-yet-linked"><Icon glyph={Announcement} /></Link>
                  <Link to="/dashboard#demo-not-yet-linked"><Icon glyph={Download} /></Link>
                  <Link to="/dashboard#demo-not-yet-linked"><Icon glyph={Upload} /></Link>
                  <Link to="/dashboard#demo-not-yet-linked"><Icon glyph={Chat} /></Link>
                </div>
              </li>
            ));

            activities.push(newActivities);
          }

          if (this.props.subjects[subject].teachers) {
            for (let i = 0; i < this.props.subjects[subject].teachers.length; i += 1) {
              const teacher = this.props.users[this.props.subjects[subject].teachers[i]];
              if (teacher) {
                teachers += `${teacher.info.firstName} ${teacher.info.lastName1}`;
                if (i < this.props.subjects[subject].teachers.length - 1) {
                  teachers += ', ';
                }
              }
            }
          }

          return (
            <li
              key={subject}
              className="item"
              style={{
                borderLeftColor: this.props.colors[c]
              }}
            >
              <Link to={`/subjects/${this.props.subjects[subject].slug}`}>{this.props.subjects[subject].title}</Link>
              <div className="teachers"><Icon glyph={Teacher} />{teachers}</div>
            </li>
          );
        });
      });
    }

    return (
      <section className="dashboard page">
        {(!isLoaded(subjects) && !isLoaded(activities))
          ? <div className="loader-small" />
          : <div className="page-wrapper">
            <div className="columns">
              <div className="column">
                <h1 className="dashboard-title">My courses</h1>
                <ul className="items-list">
                  { this.props.courses && this.renderCourses() }
                </ul>
              </div>
              <div className="column">
                <h1 className="dashboard-title">My current activities</h1>
                <ul className="items-list">
                  {!isEmpty(activities)
                    ? activities
                    : 'None'}
                </ul>
              </div>
            </div>
          </div>}
      </section>
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
    isDesktop
  }
}) => ({ isDesktop });

export default compose(
  firebaseConnect(['courses', 'subjects', 'activities', 'users']),
  connect(state => ({
    courses: state.firebase.data.courses,
    subjects: state.firebase.data.subjects,
    activities: state.firebase.data.activities,
    users: state.firebase.data.users
  })),
  connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
