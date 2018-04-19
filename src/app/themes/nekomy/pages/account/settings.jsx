import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';
import { setLoading, setUser, setNotification, setUserData } from '../../../../core/actions/actions';
import * as CONSTANTS from '../../../../core/constants/constants';
import { hideElem, showElem } from '../../../../core/common/helpers';
import avatarPlaceholder from '../../../../../../static/img/placeholder-avatar.png';
import Page from '../../components/page/page';

class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      info: {}
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    if (isEmpty(this.state.info) && isLoaded(this.props.userData)) {
      this.setState({ info: this.props.userData.info });
    }
  }

  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'account-settings-page');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.userData && (newProps.userData !== this.props.userData) && isEmpty(this.state.info)) {
      this.setState({ info: newProps.userData.info });
    }
  }

  updatePassword() {
    if (this.refs.password.value === this.refs.password2.value) {
      if (this.refs.password.value.length >= 6) {
        if (this.props.user.email !== CONSTANTS.DEMO_EMAIL) {
          hideElem('.js-btn-password');
          showElem('.js-password-loader');

          this.props.user.updatePassword(this.refs.password.value).then(() => {
            showElem('.js-btn-password');
            hideElem('.js-password-loader');
            this.props.setNotification({ message: CONSTANTS.PASSWORD_CHANGED, type: 'success' });
          }, (error) => {
            showElem('.js-btn-password');
            hideElem('.js-password-loader');
            this.props.setNotification({ message: String(error), type: 'error' });
          });
        }
      } else {
        this.props.setNotification({ message: CONSTANTS.PASSWORD_MIN_LENGTH_ERROR, type: 'error' });
      }
    } else {
      this.props.setNotification({ message: CONSTANTS.PASSWORD_MATCH_ERROR, type: 'error' });
    }
  }

  updateUserInfo() {
    if (this.props.user.email !== CONSTANTS.DEMO_EMAIL) {
      if (this.state.info.displayName === '' || this.state.info.firstName === '' || this.state.info.lastName1 === '') {
        this.props.setNotification({ message: CONSTANTS.USER_INFO_EMPTY, type: 'error' });
        return;
      }

      hideElem('.js-btn-info');
      showElem('.js-info-loader');

      this.props.firebase.set(`users/${this.props.user.uid}/info`, this.state.info).then(() => {
        showElem('.js-btn-info');
        hideElem('.js-info-loader');
        this.props.setNotification({ message: CONSTANTS.USER_INFO_CHANGED, type: 'success' });

        if (this.props.user.email !== this.state.info.email) {
          this.props.user.updateEmail(this.state.info.email).then(() => {
            this.props.user.sendEmailVerification();
            this.props.firebase.logout();
            this.props.setUser(null);
          }, (error) => {
            showElem('.js-btn-email');
            hideElem('.js-email-loader');
            this.props.setNotification({ message: String(error), type: 'error' });
          });
        }
      }, (error) => {
        showElem('.js-btn-info');
        hideElem('.js-info-loader');
        this.props.setNotification({ message: String(error), type: 'error' });
      });
    }
  }

  handleChange(event) {
    const newInfo = Object.assign({}, this.state.info, {
      [event.target.name]: event.target.value
    });
    this.setState({ info: newInfo });
  }

  render() {
    return (
      <Page additionalClass={'account-settings'}>
        {(this.props.user && this.props.userData && this.state.info) ?
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <div className="account-details">
                <img alt={'Profile card'} className={'photo'} role={'presentation'} src={avatarPlaceholder} />
                <input type="text" name="displayName" className="display-name" placeholder="Display name" value={this.state.info.displayName} onChange={this.handleChange} />
                <input type="email" name="email" ref="email" placeholder="Email" value={this.state.info.email} onChange={this.handleChange} />

                <input type="password" ref="password" name="password" className="password" placeholder="New password" value={this.state.password} />
                <input type="password" ref="password2" name="password2" placeholder="Repeat password" value={this.state.password2} />
                <button className="btn btn-primary btn-xs js-btn-password float-right" onClick={() => this.updatePassword()}>Update password</button>
                <div className="loader-small float-right js-password-loader" />
              </div>
            </div>
            <div className="col-xs-12 col-md-6">
              <div className="personal-details">
                <input type="text" placeholder="First names" name="firstName" value={this.state.info.firstName} onChange={this.handleChange} />
                <input type="text" placeholder="Last name" name="lastName1" value={this.state.info.lastName1} onChange={this.handleChange} />
                <input type="text" placeholder="Address" name="address" value={this.state.info.address} onChange={this.handleChange} />
                <input type="text" placeholder="Address Cd." name="address2" value={this.state.info.address2} onChange={this.handleChange} />
                <input type="text" placeholder="Post Code" name="postcode" value={this.state.info.postcode} onChange={this.handleChange} />
                <input type="text" placeholder="City" name="city" value={this.state.info.city} onChange={this.handleChange} />
                <input type="text" placeholder="State/Province" name="province" value={this.state.info.province} onChange={this.handleChange} />
                <input type="text" placeholder="Country" name="country" value={this.state.info.country} onChange={this.handleChange} />
                <input type="text" placeholder="Language" name="language" value={this.state.info.language} onChange={this.handleChange} />

                <button className="btn btn-primary btn-xs js-btn-info float-right" onClick={() => this.updateUserInfo()}>Update details</button>
                <div className="loader-small float-right js-info-loader" />
              </div>
            </div>
          </div>
          :
          <div className={'loader-small__container'}>
            <div className="loader-small" />
          </div>
          }
      </Page>
    );
  }
}

const mapDispatchToProps = {
  setLoading,
  setNotification,
  setUser,
  setUserData
};

const mapStateToProps = ({
  mainReducer: {
    user,
    userData
  }
}) => ({ user, userData });

export default compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps)
)(Settings);
