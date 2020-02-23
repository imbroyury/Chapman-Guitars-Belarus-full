import axios from 'axios';
import { requestStatuses } from './requestStatuses';

const AUTH_DATA = 'CHAPMAN_GUITARS_ADMIN_INTERFACE_AUTH_DATA';

const saveAuthData = (login, token) => localStorage.setItem(AUTH_DATA, JSON.stringify({ login, token }));
const getAuthData = () => JSON.parse(localStorage.getItem(AUTH_DATA));

class RequestState {
  constructor(state = requestStatuses.uninitialized, error = null) {
    this._state = state;
    this._error = error;
  }

  get error() {
    return this._error;
  }

  get isRunning() {
    return this._state === requestStatuses.running;
  }

  get isDone() {
    return this._state === requestStatuses.done;
  }

  get isError() {
    return this._state === requestStatuses.error;
  }

  setRunning() {
    this._error = null;
    this._state = requestStatuses.running;
  }

  setDone() {
    this._error = null;
    this._state = requestStatuses.done;
  }

  setError(error) {
    this._error = error;
    this._state = requestStatuses.error;
  }

  clone() {
    return new RequestState(this._state, this._error);
  }
}

class UserAuthService {
  constructor() {
    this._user = {
      isAuthenticated: false,
      login: null,
    };
    this._authRequest = new RequestState();
    this._subs = [];
  }

  get user() {
    return this._user;
  }

  get authRequest() {
    return this._authRequest;
  }

  _unauthenticateUser() {
    this._user = {
      isAuthenticated: false,
      login: null,
    };
  }

  _authenticateUser(login) {
    this._user = {
      isAuthenticated: true,
      login,
    };
  }

  _notifySubscribers() {
    console.log('will notify subs with: ', JSON.stringify({
      user: this.user,
      authRequestState: this.authRequest,
    }));
    console.log('subs', this._subs);
    this._subs.forEach(sub => sub({
      user: this._user,
      authRequest: this._authRequest.clone(),
    }));
  }

  onChange(fn) {
    if (typeof fn === 'function') {
      this._subs.push(fn);
    }
  }

  async login(login, password) {
    this._authRequest.setRunning();
    this._notifySubscribers();
    try {
      const { data } = await axios.post(
        '/login',
        { login, password }
      );
      console.log(data);
      saveAuthData(login, data.token);
      this._authRequest.setDone();
      this._authenticateUser(login);
    } catch(e) {
      console.log(e);
      this._authRequest.setError(e);
      this._unauthenticateUser();
    }
    this._notifySubscribers();
  }

  async logout() {
    const authData = getAuthData();
    const { login, token } = authData;
    this._authRequest.setRunning();
    this._notifySubscribers();
    try {
      await axios.post(
        '/logout',
        { login, token }
      );
      this._authRequest.setDone();
    } catch(e) {
      // do nothing
    }
    this._unauthenticateUser();
    this._notifySubscribers();
  }

  async checkToken() {
    const authData = getAuthData();
    if (authData === null) {
      this._unauthenticateUser();
    } else {
      this._authRequest.setRunning();
      this._notifySubscribers();
      try {
        const { login, token } = authData;
        const { data } = await axios.post(
          'check-token',
          { login, token }
        );
        console.log(data);
        this._authRequest.setDone();
        this._authenticateUser(login);
      } catch(e) {
        console.log(e);
        this._authRequest.setError(e);
        this._unauthenticateUser();
      }
    }
    console.log('checkToken method of AuthService', this.user);
    this._notifySubscribers();
  }
}

export default new UserAuthService();