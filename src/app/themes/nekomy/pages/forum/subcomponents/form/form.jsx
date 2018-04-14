import React, { Component } from 'react';
import _ from 'lodash';
import firebase from 'firebase';
import './form.scss';
import Message from '../message/message';

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: 'Anonymouse',
      message: '',
      list: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  handleSend() {
    console.log(this.props);
    if (this.state.message) {
      const newItem = {
        userName: this.state.userName,
        message: this.state.message,
        timestamp: Date.now()
      };

      this.props.firebase.push(`subjects/${this.props.subject}/forum/${this.props.forum}/messages`, newItem);
      this.setState({ message: '' });
    }
  }

  handleKeyPress(event) {
    if (event.key !== 'Enter') return;
    this.handleSend();
  }

  render() {
    const preparedMessages = _.values(this.props.messages);

    return (
      <div className="form">
        <div className="form__message">
          { preparedMessages.map((item, index) =>
            <Message key={index} message={item} />
          )}
        </div>
        <div className="form__row">
          <input
            className="form__input"
            type="text"
            placeholder="Type message"
            value={this.state.message}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
          <button
            className="form__button"
            onClick={this.handleSend}
          >
            send
          </button>
        </div>
      </div>
    );
  }
}
