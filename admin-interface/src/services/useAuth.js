import React, { useState, createContext, useContext, useEffect } from 'react';
import userAuthService from './AuthService';

const authContext = createContext();

// Provider component that wraps app and makes auth object available to any child component that calls useAuth().
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
  const [user, setUser] = useState(userAuthService.user);
  const [authRequest, setAuthRequest] = useState(userAuthService.authRequest);

  useEffect(() => {
    userAuthService.onChange(( { user, authRequest }) => {
      setUser(user);
      setAuthRequest(authRequest);
      console.log('notified with', user, authRequest);
    });
  }, []);

  const login = (login, password) => {
    return userAuthService.login(login, password);
  };

  const logout = () => {
    return userAuthService.logout();
  };

  const checkToken = () => {
    return userAuthService.checkToken();
  };

  console.log('user froom useAuth hook', user);

  // Return the user object and auth methods
  return {
    user,
    authRequest,
    login,
    logout,
    checkToken,
  };
}