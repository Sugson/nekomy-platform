import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import classNames from 'classnames';
import * as CONSTANTS from '../../../../core/constants/constants';
import { setLoading } from '../../../../core/actions/actions';
import Edit from '../../../../core/common/lib/edit/edit';
import PageComponent from '../../components/page/page';

class Page extends Component {

  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'detail-page');
  }

  render() {
    let page = null;

    if (isLoaded(this.props.page) && !isEmpty(this.props.page)) {
      Object.keys(this.props.page).map((key) => {
        page = this.props.page[key];
        return false;
      });
    }

    return page ? (
      <PageComponent additionalClass="static-page" headline={page.title}>
        {isLoaded(this.props.userData) && !isEmpty(this.props.userData) && this.props.userData.info.level >= CONSTANTS.ADMIN_LEVEL
          ? <div className="meta">
            <Edit editLink={`/admin/pages/edit/${page.slug}`} newLink="/admin/pages/new" />
          </div>
          : null}
        <div
          className={classNames('columns', {
            'single-column': (!page.content2 && !page.content3)
          })}
        >
          <div className="column page-content">
            <div
              className="content" dangerouslySetInnerHTML={{
                __html: CONSTANTS.converter.makeHtml(page.content1)
              }}
            />
          </div>
          {page.content2
            ? <div className="column page-sidebar">
              <div
                className="content" dangerouslySetInnerHTML={{
                  __html: CONSTANTS.converter.makeHtml(page.content2)
                }}
              />
            </div>
            : ''}
          {page.content3
            ? <div className="column page-sidebar">
              <div
                className="content" dangerouslySetInnerHTML={{
                  __html: CONSTANTS.converter.makeHtml(page.content3)
                }}
              />
            </div>
            : ''}
        </div>
      </PageComponent>
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
    `pages#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
    `users/${props.userID}`
  ]),
  connect(state => ({
    page: state.firebase.data.pages
  })),
  connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(Page);
