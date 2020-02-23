import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Card,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { inputType, inputConfig } from '../shared/inputs';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import { useLocation } from 'react-use';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const Login = () => {
  const classes = useStyles();
  let location = useLocation();
  const { from } = location.state.state || { from: { pathname: '/' } };

  const auth = useAuth();
  console.log('auth from Login', auth);

  const [inputs, setInputs] = useState({
    [inputType.login]: '',
    [inputType.password]: '',
  });

  const [inputErrors, setInputErrors] = useState({
    [inputType.password]: false,
  });

  const setInputError = (name, value) => {
    const { validator } = inputConfig[name];
    if (typeof validator === 'function') {
      setInputErrors(errors => ({...errors, [name]: !validator(value)}));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(inputs => ({...inputs, [name]: value}));
    setInputError(name, value);
  };

  const isLoginDisabled =
    Object.values(inputs).some(input => input.length === 0) ||
    Object.values(inputErrors).some(error => error);

  const isInputDisabled = false;

  const redirectAfterLogin = () => <Redirect to={from} />;

  const renderLoginForm = () => (<Card className={classes.card}>
    <Typography variant="h5" gutterBottom>Enter your credentials to log in</Typography>
    <Grid container>
      <TextField
        label="Login"
        name={inputType.login}
        value={inputs[inputType.login]}
        onChange={handleInputChange}
        disabled={isInputDisabled}
        error={inputErrors[inputType.login]}
        helperText={inputConfig[inputType.login].message}
      />
    </Grid>
    <Grid container>
      <TextField
        label="Password"
        name={inputType.password}
        value={inputs[inputType.password]}
        onChange={handleInputChange}
        type="password"
        disabled={isInputDisabled}
        error={inputErrors[inputType.password]}
        helperText={inputConfig[inputType.password].message}
      />
    </Grid>
    <Grid container>
      <Button
        variant="contained"
        onClick={() => auth.login(inputs.login, inputs.password)}
        color="primary"
        disabled={isLoginDisabled}
      >
              Log in
      </Button>
    </Grid>
  </Card>);

  return auth.user.isAuthenticated ?
    redirectAfterLogin() :
    renderLoginForm();
};

export default Login;
