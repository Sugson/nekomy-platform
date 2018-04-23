import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Iframe from 'react-iframe';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import Page from '../../components/page/page';
import { setLoading } from '../../../../core/actions/actions';

class Literature extends Component {
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

      this.props.setLoading(false);
    }
  }

  render() {
    return (
      <Page additionalClass={'forum'} headline={'Literature'}>
        <h1 className="literature__title">Books</h1>
        <ul className={'literature__list'}>
          <li>Thomas Robertazzi, Basics of Computer Networking Authors, 2012</li>
          <li>Andrew S. Tanenbaum, Computer Networks, 2010</li>
          <li>J. David Irwin, Chwan-Hwa Wu, Introduction to Computer Networks and Cybersecurity, 2013</li>
        </ul>
        <h1 className="literature__title">Video Course</h1>
        <Iframe
          url="https://www.youtube.com/embed/videoseries?list=PL6gx4Cwl9DGBpuvPW0aHa7mKdn_k9SPKO"
          width="100%"
          height="50vw"
          display="initial"
          position="relative"
          allowFullScreen
        />
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

export default enhance(Literature);
