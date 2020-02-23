// Hook (use-auth.js)
import React, { useState, createContext, useContext, useEffect } from 'react';
import authService from './AuthService';

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    authService.onAuthStateChange(user => {
      setUser(user);
    });
  }, []);

  const login = (login, password) => {
    return authService
      .login(login, password)
      .then(user => setUser(user));
  };

  const logout = () => {
    return authService
      .logout()
      .then((user) => setUser(user));
  };

  const checkToken = () => {
    return authService
      .checkToken()
      .then((user) => {
        console.log('user from checkToken', user);
        setUser(user);
      });
  };

  console.log('user froom useAuth hook', user);

  // Return the user object and auth methods
  return {
    user,
    login,
    logout,
    checkToken,
  };
}