import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import firebase from 'firebase';
import { createStore, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import rootReducer from './core/reducers/index';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

firebase.initializeApp(firebaseConfig);

const rrfConfig = {
  userProfile: 'users'
};

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
)(createStore);

const store = createStoreWithFirebase(rootReducer, {});

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
