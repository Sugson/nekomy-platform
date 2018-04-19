import React, { Component, PropTypes } from 'react';

export default class Page extends Component {
  render() {
    const { additionalClass, children, headline } = this.props;

    return (
      <div className={`page ${additionalClass}`}>
        <div className={'page-wrapper'}>
          { headline &&
            <div className={'page__headline'}>
              { headline }
            </div>
          }
          { children }
        </div>
      </div>
    );
  }
}

Page.defaultProps = {
  additionalClass: '',
  headline: ''
};

Page.propTypes = {
  additionalClass: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  headline: PropTypes.string
};

