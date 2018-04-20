import React, { Component, PropTypes } from 'react';

export default class Page extends Component {
  render() {
    const { additionalClass, children, headline, image } = this.props;

    return (
      <div className={`page ${additionalClass}`}>
        { image && headline &&
          <div className={'page__image-wrapper'} style={{ backgroundImage: `url(${image})` }}>
            <div className={'page__headline'}>
              { headline }
            </div>
          </div>
        }
        <div className={'page-wrapper'}>
          { !image && headline &&
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
  headline: '',
  image: ''
};

Page.propTypes = {
  additionalClass: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  headline: PropTypes.string,
  image: PropTypes.string
};

