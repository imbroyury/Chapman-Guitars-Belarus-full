import { requestStatuses } from '../enums/requestStatuses';
import {
  SET_USER_AUTHENTICATED,
  SET_USER_UNAUTHENTICATED,
  SET_REQUEST_RUNNING,
  SET_REQUEST_DONE,
  SET_REQUEST_ERROR
} from './types';

const initialState = {
  user: {
    isAuthenticated: false,
    login: null,
  },
  authRequest: {
    status: requestStatuses.uninitialized,
    error: null,
  }
};

export const authenticationReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
  case SET_USER_AUTHENTICATED:
    return {
      ...state,
      user: {
        isAuthenticated: true,
        login: payload.login,
      }
    };
  case SET_USER_UNAUTHENTICATED:
    return {
      ...state,
      user: {
        isAuthenticated: false,
        login: null,
      }
    };
  case SET_REQUEST_RUNNING:
    return {
      ...state,
      authRequest: {
        status: requestStatuses.running,
        error: null,
      }
    };
  case SET_REQUEST_DONE:
    return {
      ...state,
      authRequest: {
        status: requestStatuses.done,
        error: null,
      }
    };
  case SET_REQUEST_ERROR:
    return {
      ...state,
      authRequest: {
        status: requestStatuses.error,
        error: payload.error,
      }
    };
  default:
    return state;
  }
};
