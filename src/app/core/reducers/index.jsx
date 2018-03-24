import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { firebaseReducer } from 'react-redux-firebase';
import mainReducer from './mainReducer';

const rootReducer = combineReducers({
  mainReducer,
  firebase: firebaseReducer,
  routing: routerReducer
});

export default rootReducer;
