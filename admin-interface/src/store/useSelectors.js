import { useSelector } from 'react-redux';

export const useUserSelector = () => {
  return useSelector(state => state.user);
};

export const useAuthRequestSelector = () => {
  return useSelector((state) => state.authRequest);
};
