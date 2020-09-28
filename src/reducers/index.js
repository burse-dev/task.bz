import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import loadUserData from './loadUserData';
import authReducer from './auth';

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  userData: loadUserData,
});
