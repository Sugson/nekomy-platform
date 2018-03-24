import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { setLoading } from '../../../../core/actions/actions';
import * as CONSTANTS from '../../../../core/constants/constants';
import Edit from '../../../../core/common/lib/edit/edit';
import Icon from '../../../../core/common/lib/icon/icon';
import Professor from '../../../../../../static/svg/professor.svg';

class Module extends Component {
  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'module-page');
  }

  render() {
    let module = null;
    let featuredImage = null;
    let authors = '';

    if (isLoaded(this.props.module) && isLoaded(this.props.files) && isLoaded(this.props.users) && !isEmpty(this.props.module) && !isEmpty(this.props.files) && !isEmpty(this.props.users)) {
      Object.keys(this.props.module).map((key) => {
        module = this.props.module[key];
        if (module.featuredImage) {
          Object.keys(this.props.files).map((fileKey) => {
            if (fileKey === module.featuredImage) {
              featuredImage = this.props.files[fileKey];
            }
            return false;
          });
        }
        if (module.authors) {
          for (let i = 0; i < module.authors.length; i += 1) {
            const author = this.props.users[module.authors[i]];
            if (author) {
              authors += `${author.info.firstName} ${author.info.lastName1}`;
              if (i < module.authors.length - 1) {
                authors += ', ';
              }
            }
          }
        }
        return false;
      });
    }

    return (
      <section className="page module">
        {module
          ? <div className="page-wrapper">
            <h1 className="title">{module.title}</h1>
            <div className="meta">
              {authors
                ? <div className="author"><Icon glyph={Professor} />{authors}</div>
                : ''}
              {isLoaded(this.props.userData) && !isEmpty(this.props.userData) && this.props.userData.info.level >= CONSTANTS.ADMIN_LEVEL
                ? <Edit editLink={`/admin/modules/edit/${module.slug}`} newLink="/admin/modules/new" />
                : ''}
            </div>
            <div
              className={classNames('columns', {
                'single-column': (!module.content2 && !module.content2)
              })}
            >
              <div className="column page-content">
                {featuredImage
                  ? <img alt="" className="featured-image" role="presentation" src={featuredImage.url} />
                  : ''}
                <div
                  className="content" dangerouslySetInnerHTML={{
                    __html: CONSTANTS.converter.makeHtml(module.content1)
                  }}
                />
              </div>
              {module.content2
                ? <div className="column page-sidebar">
                  <div
                    className="content" dangerouslySetInnerHTML={{
                      __html: CONSTANTS.converter.makeHtml(module.content2)
                    }}
                  />
                </div>
                : ''}
              {module.content3
                ? <div className="column page-sidebar">
                  <div
                    className="content" dangerouslySetInnerHTML={{
                      __html: CONSTANTS.converter.makeHtml(module.content3)
                    }}
                  />
                </div>
                : ''}
            </div>
          </div>
        : <div className="loader-small" />}
      </section>
    );
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
    `modules#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
    'files',
    'users',
    `users/${props.userID}`
  ]),
  connect(state => ({
    module: state.firebase.data.modules,
    files: state.firebase.data.files,
    users: state.firebase.data.users
  })),
  connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(Module);
