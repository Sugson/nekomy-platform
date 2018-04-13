import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Widget } from 'react-chat-widget';
import { setLoading } from '../../../../core/actions/actions';

class Forum extends Component {
  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'subject-page');
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incomig! ${newMessage}`);
  }

  render() {
    return (
      <section className="page forum">
        <div className="page-wrapper">
          <h1 className="title">
            Discussion
          </h1>
          <Widget
            handleNewUserMessage={this.handleNewUserMessage}
            title={''}
            subtitle={''}
          />
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
    isDesktop,
    user
  }
}) => ({ isDesktop, user });

export default connect(mapStateToProps, mapDispatchToProps)(Forum);
