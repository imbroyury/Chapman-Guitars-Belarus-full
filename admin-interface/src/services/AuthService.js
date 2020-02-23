import axios from 'axios';
import {
  setAuthRequestRunning,
  setAuthRequestError,
  setAuthRequestDone,
  setUserAuthenticated,
  setUserUnauthenticated,
} from '../store/actions';

const AUTH_DATA = 'CHAPMAN_GUITARS_ADMIN_INTERFACE_AUTH_DATA';

const saveAuthData = (login, token) => localStorage.setItem(AUTH_DATA, JSON.stringify({ login, token }));
const getAuthData = () => JSON.parse(localStorage.getItem(AUTH_DATA));

const login = async (login, password) => {
  setAuthRequestRunning();
  try {
    const { data } = await axios.post(
      '/login',
      { login, password }
    );
    console.log(data);
    saveAuthData(login, data.token);
    setAuthRequestDone();
    setUserAuthenticated(login);
  } catch(e) {
    console.log(e);
    setAuthRequestError(e.response.data);
    setUserUnauthenticated();
  }
};

const logout = async () => {
  const authData = getAuthData();
  const { login, token } = authData;
  setAuthRequestRunning();
  try {
    await axios.post(
      '/logout',
      { login, token }
    );
    setAuthRequestDone();
  } catch(e) {
    // disregard error on logout
    setAuthRequestDone();
  }
  setUserUnauthenticated();
};

const checkToken = async () => {
  const authData = getAuthData();
  if (authData === null) {
    setUserUnauthenticated();
  } else {
    setAuthRequestRunning();
    try {
      const { login, token } = authData;
      const { data } = await axios.post(
        'check-token',
        { login, token }
      );
      console.log(data);
      setAuthRequestDone();
      setUserAuthenticated(login);
    } catch(e) {
      console.log(e);
      setAuthRequestError(e.response.data);
      setUserUnauthenticated();
    }
  }
};

export default {
  login,
  logout,
  checkToken,
};