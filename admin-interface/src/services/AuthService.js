import axios from 'axios';

const AUTH_DATA = 'CHAPMAN_GUITARS_ADMIN_INTERFACE_AUTH_DATA';

const saveAuthData = (login, token) => localStorage.setItem(AUTH_DATA, JSON.stringify({ login, token }));
const getAuthData = () => JSON.parse(localStorage.getItem(AUTH_DATA));

class AuthService {
  constructor() {
    this._user = {
      isAuthenticated: false,
      login: null,
    };
    this._requestState = null;
    this._subs = [];
  }

  getUser() {
    return this._user;
  }

  async login(login, password) {
    try {
      const { data } = await axios.post(
        '/login',
        { login, password }
      );
      console.log(data);
      saveAuthData(login, data.token);
      this._user = {
        isAuthenticated: true,
        login,
      };
    } catch(e) {
      console.log(e);
      this._user = {
        isAuthenticated: false,
        login: null
      };
    }
    this.notifySubscribers();
    return this._user;
  }

  async logout() {
    this._user = {
      isAuthenticated: false,
      login: null
    };
    this.notifySubscribers();
    return this._user;
  }

  async checkToken() {
    const authData = getAuthData();
    if (authData === null) {
      this._user = {
        isAuthenticated: false,
        login: null
      };
    } else {
      try {
        const { data } = await axios.post(
          'check-token',
          { loign: authData.login, token: authData.token }
        );
        console.log(data);
        this._user = {
          isAuthenticated: true,
          login: authData.login,
        };
      } catch(e) {
        console.log(e);
        this._user = {
          isAuthenticated: false,
          login: null
        };
      }
    }
    console.log('checkToken method of AuthService', this._user);
    this.notifySubscribers();
    return this._user;
  }

  async validateToken() {
    return true;
  }

  notifySubscribers() {
    console.log('will notify subs with: ', this._user);
    this._subs.forEach(sub => sub(this._user));
  }

  onAuthStateChange(fn) {
    this._subs.push(fn);
  }
}

export default new AuthService();