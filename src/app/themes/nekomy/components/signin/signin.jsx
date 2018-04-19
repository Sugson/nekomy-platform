import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import firebase from 'firebase';
import { hideElem, showElem } from '../../../../core/common/helpers';
import { setNotification } from '../../../../core/actions/actions';

class Signin extends Component {

  constructor(props) {
    super(props);

    this.handleSignin = this.handleSignin.bind(this);
  }

  handleSignin(e) {
    e.preventDefault();
    hideElem('.js-btn-signin');
    hideElem('.js-link-signup');
    showElem('.js-signin-loader');

    const email = String(this.refs.email.value);
    const { password } = this.refs;

    firebase.auth().signInWithEmailAndPassword(email, password.value).then(() => {
      showElem('.js-btn-signin');
      showElem('.js-link-signup');
      hideElem('.js-signin-loader');
      document.querySelector('.js-overlay').click();
      browserHistory.push('/dashboard');
    }).catch((error) => {
      showElem('.js-btn-signin');
      showElem('.js-link-signup');
      hideElem('.js-signin-loader');
      this.props.setNotification({ message: String(error), type: 'error' });
    });
  }

  render() {
    return (
      <form className={`user-form sign-in ${this.props.showClass}`} onSubmit={this.handleSignin}>
        <input type="text" className="input-field" ref="email" placeholder="Email" />
        <input type="password" className="input-field" placeholder="Password" ref="password" />
        <button type="submit" className="btn btn-primary js-btn-signin">Sign in</button>
        <a className="js-link-signup" onClick={this.props.switchToRegister}>I want to sign up</a>
        <div className="loader-small js-signin-loader" />
      </form>
    );
  }
}

const mapStateToProps = null;

const mapDispatchToProps = {
  setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
