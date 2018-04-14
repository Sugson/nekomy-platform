import React, { Component } from 'react';
import './message.scss';

export default class Message extends Component {
  render() {
    const { userName, timestamp, message } = this.props.message;

    return (
      <div className="message">
        <div className={'message__header'}>
          <span className="message__author">
            { userName }
          </span>
          <span className="message__date">
            { new Date(timestamp).toLocaleString() }
          </span>
        </div>
        <div className={'message__body'}>
          { message }
        </div>
      </div>
    );
  }
}
