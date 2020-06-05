import {
  setAuthRequestRunning,
  setAuthRequestError,
  setAuthRequestDone,
  setUserAuthenticated,
  setUserUnauthenticated,
} from '../store/actions';
import { postRequest } from './NetworkService';

const AUTH_DATA = 'CHAPMAN_GUITARS_ADMIN_INTERFACE_AUTH_DATA';

const saveAuthData = (login, token) => localStorage.setItem(AUTH_DATA, JSON.stringify({ login, token }));
const getAuthData = () => JSON.parse(localStorage.getItem(AUTH_DATA));

export const getAuthToken = () => {
  const authData = getAuthData();
  return authData ? authData.token : null;
};

export const loginRequest = async (login, password) => {
  setAuthRequestRunning();
  try {
    const { data } = await postRequest(
      '/login',
      { login, password },
      false
    );
    saveAuthData(login, data.token);
    setAuthRequestDone();
    setUserAuthenticated(login);
  } catch(e) {
    setAuthRequestError(e.response.data.errorMessage);
    setUserUnauthenticated();
  }
};

export const logoutRequest = async () => {
  const authData = getAuthData();
  const { token } = authData;
  setAuthRequestRunning();
  try {
    await postRequest(
      '/logout',
      { token },
      false
    );
    setAuthRequestDone();
  } catch(e) {
    // disregard error on logout
    setAuthRequestDone();
  }
  setUserUnauthenticated();
};

export const checkTokenRequest = async () => {
  const authData = getAuthData();
  if (authData === null) {
    setUserUnauthenticated();
  } else {
    setAuthRequestRunning();
    try {
      const { login, token } = authData;
      await postRequest(
        'check-token',
        { token },
        false
      );
      setAuthRequestDone();
      setUserAuthenticated(login);
    } catch(e) {
      setAuthRequestError(e.response.data.errorMessage);
      setUserUnauthenticated();
    }
  }
};
