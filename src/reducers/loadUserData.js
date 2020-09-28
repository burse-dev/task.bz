import {
  LOAD_AUTH_USER_DATA,
} from '../actions/types';

const DEFAULT_STATE = {
  authUser: {},
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case LOAD_AUTH_USER_DATA:
      return { ...state, ...{ authUser: action.payload } };
    default:
      return state;
  }
};
