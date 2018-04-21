import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import Page from '../../components/page/page';
import { setLoading } from '../../../../core/actions/actions';

class Lesson extends Component {
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
      <Page additionalClass={'forum'} headline={'Lesson'}>
        hmm...
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

export default enhance(Lesson);
