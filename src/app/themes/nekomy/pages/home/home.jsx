import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { setLoading } from '../../../../core/actions/actions';

class Home extends Component {
  componentDidMount() {
    this.props.setLoading(false);
    const el = document.querySelector('.js-main');
    el.classList = '';
    el.classList.add('main', 'js-main', 'home-page', 'has-hero');
  }

  render() {
    return (
      <section className="home page">
        <div className="hero" />
      </section>
    );
  }
}

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = ({
  mainReducer: {
    isDesktop
  }
}) => ({ isDesktop });

export default compose(
  firebaseConnect([
    'posts',
    'files',
    'courses',
    'levels'
  ]),
  connect(state => ({
    posts: state.firebase.data.posts,
    files: state.firebase.data.files,
    courses: state.firebase.data.courses,
    levels: state.firebase.data.levels
  })),
  connect(mapStateToProps, mapDispatchToProps)
)(Home);
