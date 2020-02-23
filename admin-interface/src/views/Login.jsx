import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Paper,
  Button,
  Grid,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { requestStatuses } from '../requestStatuses';
import { inputType, inputConfig } from '../shared/inputs';
import errors from '../shared/errors';
import AuthService from '../services/AuthService';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../services/useAuth';

const useStyles = makeStyles(theme => ({
  paper: {
  },
  snackbarMessage: {
    display: 'flex',
    alignItems: 'center',
  },
  snackbarIcon: {
    fontSize: 20,
    marginRight: '0.5rem',
  },
  snackbarSuccess: {
    backgroundColor: green[600],
  },
  snackbarError: {
    backgroundColor: theme.palette.error.dark,
  }
}));

const Login = () => {
  const classes = useStyles();

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
    event.persist();
    const { name, value } = event.target;
    setInputs(inputs => ({...inputs, [name]: value}));
    setInputError(name, value);
  };


  const isLoginDisabled =
    Object.values(inputs).some(input => input.length === 0) ||
    Object.values(inputErrors).some(error => error) ||
    false;

  const isInputDisabled = false;

  const renderSuccessMessage = () =>
    (<Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open
      autoHideDuration={3000}
    >
      <SnackbarContent
        className={classes.snackbarSuccess}
        message={
          <span className={classes.snackbarMessage}>
            <CheckCircleIcon className={classes.snackbarIcon}/>
          You are logged in.
          </span>
        }
      />
    </Snackbar>);

  const renderErrorMessage = () =>
    (<Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open
      autoHideDuration={3000}
    >
      <SnackbarContent
        className={classes.snackbarError}
        message={
          <span className={classes.snackbarMessage}>
            <ErrorIcon className={classes.snackbarIcon}/>
          </span>
        }
      />
    </Snackbar>);

  const renderLoginForm = () => (<Grid container>
    <Paper className={classes.paper}>
      <Typography variant="h5" gutterBottom>Enter your credentials to log in</Typography>
      <Grid container>
        <TextField
          label="Login"
          name={inputType.login}
          value={inputs[inputType.login]}
          onChange={handleInputChange}
          disabled={isInputDisabled}
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
    </Paper>
  </Grid>);

  return auth.user.isAuthenticated ?
    renderSuccessMessage() :
    renderLoginForm();
};

export default Login;
