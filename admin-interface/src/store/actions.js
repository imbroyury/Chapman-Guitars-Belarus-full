import { store } from './index';
import {
  SET_USER_AUTHENTICATED,
  SET_USER_UNAUTHENTICATED,
  SET_REQUEST_RUNNING,
  SET_REQUEST_DONE,
  SET_REQUEST_ERROR,
} from './types';

export const setUserAuthenticated = (login) => store.dispatch({
  type: SET_USER_AUTHENTICATED,
  payload: { login },
});

export const setUserUnauthenticated = () => store.dispatch({
  type: SET_USER_UNAUTHENTICATED,
});

export const setAuthRequestRunning = () => store.dispatch({
  type: SET_REQUEST_RUNNING,
});

export const setAuthRequestDone = () => store.dispatch({
  type: SET_REQUEST_DONE,
});

export const setAuthRequestError = (error) => store.dispatch({
  type: SET_REQUEST_ERROR,
  payload: { error },
});
