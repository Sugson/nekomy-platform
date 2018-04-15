import React, { Component } from 'react';
import _ from 'lodash';
import StayScrolled from 'react-stay-scrolled';
import './form.scss';
import Message from '../message/message';

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (_.values(prevProps.messages).length < _.values(this.props.messages).length) {
      this.stayScrolled();
    }

    if (prevProps.update < this.props.update) {
      this.stayScrolled();
    }
  }

  storeScrolledControllers = ({ stayScrolled, scrollBottom }) => {
    this.stayScrolled = stayScrolled;
    this.scrollBottom = scrollBottom;
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  handleSend() {
    const { message } = this.state;
    const { user, firebase, forum, subject } = this.props;

    if (message) {
      const newItem = {
        userName: user ? user.displayName : 'John Doe',
        message,
        timestamp: Date.now()
      };

      firebase.push(`subjects/${subject}/forum/${forum}/messages`, newItem);
      // firebase.update(`subjects/${subject}/forum/${forum}`, { updated: Date.now() });
      this.setState({ message: '' });
      this.scrollBottom();
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
        <StayScrolled provideControllers={this.storeScrolledControllers} className="form__message">
          { preparedMessages.map((item, index) =>
            <Message key={index} message={item} />
          )}
        </StayScrolled>
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
