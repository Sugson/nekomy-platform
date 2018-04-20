import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, getVal, isLoaded, isEmpty } from 'react-redux-firebase';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router';
import { setLoading } from '../../../../core/actions/actions';
import * as CONSTANTS from '../../../../core/constants/constants';
import ModalBox from '../../../../core/common/modalbox/modalbox';
import { animateCss, hideElem, showElem } from '../../../../core/common/helpers';
import Icon from '../../../../core/common/lib/icon/icon';
import Info from '../../../../../../static/svg/info.svg';
import Teacher from '../../../../../../static/svg/professor.svg';
import Calendar from '../../../../../../static/svg/calendar2.svg';
import Page from '../../components/page/page';

class Course extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalTitle: ''
    };

    this.modalBoxAnswer = this.modalBoxAnswer.bind(this);
  }

  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'course-page');
  }

  enrolConfirmation() {
    this.setState({
      modalTitle: CONSTANTS.CONFIRM_ENROL
    }, () => {
      animateCss(showElem('.js-modal-box-wrapper'), 'fade-in');
    });
  }

  modalBoxAnswer(answer) {
    if (answer === 'accept') {
      let courseID = null;
      Object.keys(this.props.course).map((key) => {
        courseID = key;
        return false;
      });

      const courseData = {
        finalGrade: '',
        status: 'enrolled'
      };

      hideElem(this.refs['btn-enroll']);
      showElem(this.refs['loader-enroll']);

      this.props.firebase.set(`users/${this.props.user.uid}/courses/${courseID}`, courseData).then(() => {
        showElem(this.refs['btn-enroll']);
        hideElem(this.refs['loader-enroll']);
        this.props.setNotification({ message: CONSTANTS.ENROLLED_COURSE, type: 'success' });
      }, (error) => {
        showElem(this.refs['btn-enroll']);
        hideElem(this.refs['loader-enroll']);
        this.props.setNotification({ message: String(error), type: 'error' });
      });
    }
  }

  render() {
    let course = null;
    let featuredImage = null;
    let enrollmentOpened = false;
    let subjects = null;
    const section = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);

    if (isLoaded(this.props.course) && isLoaded(this.props.files) && !isEmpty(this.props.course) && !isEmpty(this.props.files)) {
      Object.keys(this.props.course).map((key) => {
        course = this.props.course[key];

        if (course.featuredImage) {
          Object.keys(this.props.files).map((fileKey) => {
            if (fileKey === course.featuredImage) {
              featuredImage = this.props.files[fileKey];
            }
            return false;
          });
        }

        if (moment().isBetween(moment(course.startDate), moment(course.endDate), 'days', '[]')) {
          enrollmentOpened = true;
        }
        return false;
      });
    }

    if (course && course.subjects && isLoaded(this.props.subjects) && !isEmpty(this.props.subjects) && isLoaded(this.props.users) && !isEmpty(this.props.users)) {
      subjects = course.subjects.map((item, i) => {
        const subject = this.props.subjects[course.subjects[i]];
        let teachers = '';
        const isDisabled = subject.status !== 'active';

        if (subject.teachers) {
          teachers = subject.teachers.map((teacher) => {
            if (teacher && this.props.users[teacher]) {
              return <div key={teacher}>{this.props.users[teacher].info.displayName}</div>;
            }
            return '';
          });
        }

        return (
          <div className="col-xs-12 col-md-4">
            { !isDisabled ?
              <Link to={`/subjects/${subject.slug}`}>
                <div className={'box dashboard__course-card'} key={`course.code-${i}`}>
                  <div>{subject.shortTitle}</div>
                  <div className="teachers">
                    <Icon glyph={Teacher} />
                    { teachers }
                  </div>
                </div>
              </Link>
            :
              <div className={'dashboard__course-card disabled'} key={`course.code-${i}`}>
                <div>{subject.shortTitle}</div>
                <div className="teachers">
                  <Icon glyph={Teacher} />
                  { teachers }
                </div>
              </div>
            }
          </div>
        );
      });
    }

    return course ? (
      <Page additionalClass={'course'} headline={course && course.title} image={featuredImage.url}>
        <div className={'course__enrollment'}>
          <div className="meta">
            <Icon glyph={Calendar} />Enrollment available from&nbsp;
            <span className="date">{moment(course.startDate).format('D MMMM YYYY')}</span>
            &nbsp;until&nbsp;
            <span className="date">{moment(course.endDate).format('D MMMM YYYY')}</span>
          </div>
          {section !== 'subjects' && subjects && enrollmentOpened
            ? <button className="btn btn-primary btn-enroll">
              <Link to={`/courses/${course.slug}/subjects`}>Enrol now</Link>
            </button>
            : ''}
        </div>
        <ul className="horizontal-nav">
          <li
            className={classNames('horizontal-nav-item', {
              active: section === this.props.params.slug
            })}
          >
            <Link to={`/courses/${course.slug}`}>About course</Link>
          </li>
          <li
            className={classNames('horizontal-nav-item', {
              active: section === 'goals'
            })}
          >
            <Link to={`/courses/${course.slug}/goals`}>Course goals</Link>
          </li>
          <li
            className={classNames('horizontal-nav-item', {
              active: section === 'subjects',
              hidden: !subjects
            })}
          >
            <Link to={`/courses/${course.slug}/subjects`}>Subjects</Link>
          </li>
        </ul>
        <div
          className={classNames('', {
            hidden: (section !== this.props.params.slug)
          })}
        >
          <div>
            {ReactHtmlParser(course.about)}
          </div>
        </div>
        <div
          className={classNames('', {
            hidden: (section !== 'subjects')
          })}
        >
          <div>
            {!isLoaded(this.props.userData) || isEmpty(this.props.userData)
              ? <p><Icon glyph={Info} className="icon info-icon" />Sign in to enrol in this course</p>
              : null}
            <div className={'row start'}>
              {subjects}
            </div>
            {enrollmentOpened && isLoaded(this.props.userData) && !isEmpty(this.props.userData)
              ? <button ref="btn-enroll" className="btn btn-primary btn-enroll" onClick={() => this.enrolConfirmation()}>Proceed with the registration</button>
              : ''}
            <div ref="loader-enroll" className="loader-small loader-enroll" />
          </div>
        </div>
        <div
          className={classNames('', {
            hidden: (section !== 'goals')
          })}
        >
          <div>
            {ReactHtmlParser(course.goals)}
          </div>
        </div>
        <div
          className={classNames('', {
            hidden: (section !== 'requirements')
          })}
        >
          <div
            className="content" dangerouslySetInnerHTML={{
              __html: CONSTANTS.converter.makeHtml(course.requirements)
            }}
          />
        </div>
        <ModalBox title={this.state.modalTitle} answer={this.modalBoxAnswer} />
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
    userData
  }
}) => ({ isDesktop, userData });

const enhance = compose(
  firebaseConnect(props => [
    `courses#orderByChild=slug&equalTo=${props.params.slug}`,
    'levels',
    'subjects',
    'users',
    'files',
    `users/${props.userID}`
  ]),
  connect(({ firebase }, props) => ({
    userData: getVal(firebase, `users/${props.user
      ? props.user.uid
      : null}`),
    userID: props.user
      ? props.user.uid
      : null,
    courseID: props.course
      ? props.course[Object.keys(props.course)[0]].code
      : ''
  })),
  connect(state => ({
    users: state.firebase.data.users,
    levels: state.firebase.data.levels,
    course: state.firebase.data.courses,
    subjects: state.firebase.data.subjects,
    files: state.firebase.data.files
  })),
  connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(Course);

