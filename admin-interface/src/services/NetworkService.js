import axios from 'axios';
import headers from '../shared/headers';
import { getAuthToken } from './AuthService';
import { setUserUnauthenticated, setAuthRequestError } from '../store/actions';
import { URLS, SERVER_TYPE_ENUM } from '../shared/hosts';

const baseUrl = `${URLS[SERVER_TYPE_ENUM.proxy]}/admin`;
const unauthxios = axios.create({ baseURL: baseUrl });
const authxios = axios.create({ baseURL: baseUrl });

authxios.interceptors.request.use(
  (config) => {
    const authToken = getAuthToken();
    config.headers[headers.userToken] = authToken;
    return config;
  }
);

authxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      setAuthRequestError(error.response.data.errorMessage);
      setUserUnauthenticated();
    }
    throw error;
  },
);

const getAxiosInstance = (useAuth = true) => useAuth
  ? authxios
  : unauthxios;

export const getRequest = (url, useAuth = true) =>
  getAxiosInstance(useAuth).get(url);

export const postRequest = (url, body, useAuth = true) =>
  getAxiosInstance(useAuth).post(url, body);

export const putRequest = (url, body, useAuth = true) =>
  getAxiosInstance(useAuth).put(url, body);

export const deleteRequest = (url, body, useAuth = true) =>
  getAxiosInstance(useAuth).delete(url, body);
