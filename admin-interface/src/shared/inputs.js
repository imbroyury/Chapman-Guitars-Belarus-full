export const inputType = {
  'password': 'password',
  'login': 'login',
};

const isLoginValid = (login) => typeof login === 'string' && login.length >= 4;
const isPasswordValid = (password) => typeof password === 'string' && password.length >= 6;

export const inputConfig = {
  [inputType.password]: {
    validator: isPasswordValid,
    message: 'Your password should be at least 6 characters long',
  },
  [inputType.login]: {
    validator: isLoginValid,
    message: 'Your login should be at least 4 characters long',
  },
};