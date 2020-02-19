import React from 'react';
import PropTypes from 'prop-types';
import {
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Error as ErrorIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  snackbarMessage: {
    display: 'flex',
    alignItems: 'center',
  },
  snackbarIcon: {
    fontSize: 20,
    marginRight: '0.5rem',
  },
  snackbarError: {
    backgroundColor: theme.palette.error.dark,
  },
}));

const ErrorSnackbar = (props) => {
  const classes = useStyles();

  return (<Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={props.open}
  >
    <SnackbarContent
      className={classes.snackbarError}
      message={
        <span className={classes.snackbarMessage}>
          <ErrorIcon className={classes.snackbarIcon}/>
          {props.errorMessage}
          {'.\nPlease try again later'}
        </span>
      }
      action={props.action}
    />
  </Snackbar>);
};

ErrorSnackbar.propTypes = {
  open: PropTypes.bool,
  errorMessage: PropTypes.string,
  action: PropTypes.node,
};

export default ErrorSnackbar;