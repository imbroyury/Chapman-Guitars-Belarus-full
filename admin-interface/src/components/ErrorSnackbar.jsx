import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
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
  actionButton: {
    color: 'white'
  }
}));

const ErrorSnackbar = (props) => {
  const classes = useStyles();
  const { open, errorMessage, actionLabel, actionHandler } = props;

  const renderAction = () => (actionLabel && actionHandler)
    ? <Button onClick={actionHandler} size="small" className={classes.actionButton}>{actionLabel}</Button>
    : null;

  return (<Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={open}
  >
    <SnackbarContent
      className={classes.snackbarError}
      message={
        <span className={classes.snackbarMessage}>
          <ErrorIcon className={classes.snackbarIcon}/>
          {errorMessage}
          {'.\nPlease try again later'}
        </span>
      }
      action={renderAction()}
    />
  </Snackbar>);
};

ErrorSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  actionHandler: PropTypes.func,
};

export default ErrorSnackbar;