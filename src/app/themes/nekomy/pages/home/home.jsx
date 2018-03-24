import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { Link } from 'react-router';
import { renderCards } from '../../../../core/common/helpers';
import { setLoading } from '../../../../core/actions/actions';

class Home extends Component {
  componentDidMount() {
    this.props.setLoading(false); // Move this to API callback when implemented (if ever)
    const el = document.querySelector('.js-main');
    el.classList = '';
    el.classList.add('main', 'js-main', 'home-page', 'has-hero');
  }

  renderPosts = () => (
    <ul className="cards-list posts-list">
      { renderCards('blog', this.props) }
    </ul>
  );

  render() {
    const { posts, files } = this.props;
    return (
      <section className="home page">
        <div className="hero" />
        <div className="cards courses">
          <h2 className="cards-heading">Latest courses</h2>
          <Link to="/upload">
            <button className="btn btn-primary">Upload your first course</button>
          </Link>
        </div>
        <div className="cards posts">
          <h2 className="cards-heading">News &amp; Updates</h2>
          { (posts && files) ? this.renderPosts() : <div className="loader-small" /> }
        </div>
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
