import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { renderCards } from '../../../../core/common/helpers';
import { setLoading } from '../../../../core/actions/actions';
import Page from '../../components/page/page';

class Listing extends Component {
  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'listing-page');
  }

  render() {
    let type = this.props.location.pathname.slice(1);
    let items = null;
    const path = type;

    if (path === 'blog') {
      type = 'posts';
    }

    if (isLoaded(this.props[type]) && !isEmpty(this.props[type]) && isLoaded(this.props.files)) {
      items = <ul className="cards-list row">{renderCards(path, this.props)}</ul>;
    } else {
      items = <div className="loader-small" />;
    }
    return (
      <Page additionalClass={'listing-page'} headline={_.capitalize(path)}>
        <div className="cards">
          {items}
        </div>
      </Page>
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
  firebaseConnect(['courses', 'subjects', 'modules', 'activities', 'posts', 'levels', 'files']),
  connect(state => ({
    courses: state.firebase.data.courses,
    subjects: state.firebase.data.subjects,
    modules: state.firebase.data.modules,
    activities: state.firebase.data.activities,
    posts: state.firebase.data.posts,
    levels: state.firebase.data.levels,
    files: state.firebase.data.files
  })),
  connect(mapStateToProps, mapDispatchToProps)
)(Listing);
