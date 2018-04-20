import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router';
import { converter } from '../constants/constants';
import Icon from './lib/icon/icon';
import Calendar from '../../../../static/svg/calendar2.svg';
import Course from '../../../../static/svg/course.svg';
import Users from '../../../../static/svg/users.svg';

// String capitalization
String.prototype.capitalize = () => (this ? this.charAt(0).toUpperCase() + this.slice(1) : null);

// Common app methods
module.exports = {

  renderCards: (type, props) => {
    let newList = [];
    const path = type;

    if (type === 'blog') {
      type = 'posts';
    }

    newList = Object.keys(props[type]).map((key) => {
      const item = props[type][key];
      const date = (type === 'courses')
          ? item.startDate
          : item.date;

      if (item && item.status && item.status !== 'inactive') {
        return (
          <div className={' col-xs-12 col-sm-4'}>
            <Link to={`/${path}/${item.slug}`}>
              <li key={key} ref={`item-${key}`} className={`box card ${type}-card`}>
                <Link to={`/${path}/${item.slug}`}>{item.featuredImage
                    ? <div
                      className="card-thumb card-image" style={{
                        backgroundImage: `url(${props.files[item.featuredImage].url})`
                      }}
                    />
                    : <div className="card-thumb">
                      <span>{item.code}</span>
                    </div>}</Link>
                <div className="card-wrapper clearfix">
                  <h3 className="card-title">
                    {item.title}
                  </h3>
                  <div className="card-meta">
                    { (item.startDate || item.endDate) && <Icon glyph={Calendar} />}
                    { item.startDate && moment(date).format('DD.MM.YYYY') }
                    { (item.startDate || item.endDate) && <span>&nbsp;-&nbsp;</span> }
                    { item.endDate && moment(item.endDate).format('DD.MM.YYYY') }
                  </div>
                  <div
                    className="card-content" dangerouslySetInnerHTML={{
                      __html: converter.makeHtml(item.excerpt)
                    }}
                  />
                </div>
              </li>
            </Link>
          </div>
        );
      }
      return '';
    });

    return newList;
  },

  slugify: string =>
    string.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),

  copyTextToClipboard: (text) => {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.select();

    document.body.removeChild(textArea);
  },

  getAppVersion: (element) => {
    axios
      .get('/static/version.json')
      .then((response) => {
        if (response.data) {
          const date = new Date(response.data.version.buildDate);
          const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ];
          if (document.querySelector(element)) {
            document.querySelector(element).innerHTML = `v${response.data.version.version} (Built on ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()})`;
          }
        }
      });
  },

  animateCss: (element, animationName, callback) => {
    element.classList.add('animated', animationName);
    element.addEventListener('animationend', function handler() {
      element.classList.remove('animated', animationName);
      element.removeEventListener('animationend', handler);
      if (callback) {
        callback();
      }
    });
  },

  hideElem: (selector) => {
    const elem = (typeof (selector) === 'string' || selector instanceof String)
      ? document.querySelector(selector)
      : selector;
    elem.style.display = 'none';
    return elem;
  },

  showElem: (selector) => {
    const elem = (typeof (selector) === 'string' || selector instanceof String)
      ? document.querySelector(selector)
      : selector;
    elem.style.display = 'block';
    return elem;
  }

};
