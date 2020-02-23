import { createStore } from 'redux';
import { authenticationReducer } from './reducer';

export const store = createStore(authenticationReducer);

export default store;