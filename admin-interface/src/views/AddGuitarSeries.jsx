import React, { useState } from 'react';
import axios from 'axios';
import { useAsyncFn } from 'react-use';
import {
  Grid,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import { Error as ErrorIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../components/Spinner';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '20px',
  },
  card: {
    margin: '10px',
  },
  img: {
    maxWidth: '300px',
  },
  uploadInput: {
    display: 'none'
  },
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
  reloadButton: {
    color: 'white'
  }
}));

const AddGuitarSeries = () => {
  const classes = useStyles();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [series, setSeries] = useState({
    name: '',
    uri: '',
    order: 0,
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setSeries({
      ...series,
      [name]: value,
    });
  };

  const [addSeriesState, addSeries] = useAsyncFn(async () => {
    const formData = new FormData();
    const { name, uri, order } = series;
    const { data: uploadResult } = await axios.put(
      '/guitar-series',
      { name, uri, order },
      formData,
    );
    setShouldRedirect(true);
    return uploadResult;
  }, [series]);

  const requestStates = [
    addSeriesState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const isInteractionDisabled = isSomeRequestInProgress;

  const isAddDisabled = isInteractionDisabled || series.name === '' || series.uri === '';

  const renderErrorMessage = (errorMessage) =>
    (<Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open
      key={errorMessage}
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
        action={
          <Button onClick={addSeries} size="small" className={classes.reloadButton}>Retry</Button>
        }
      />
    </Snackbar>);

  const renderAddSeriesForm = () => <Card className={classes.card}>
    <CardContent>
      <Grid container><TextField label='Name' name="name" value={series.name} onChange={handleChangeInput}/></Grid>
      <Grid container><TextField label='Uri' name="uri" value={series.uri} onChange={handleChangeInput}/></Grid>
      <Grid container><TextField label='Order' name="order" type="number" value={series.order} onChange={handleChangeInput}/></Grid>
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={addSeries}
        disabled={isAddDisabled}
      >
        Add
      </Button>
    </CardActions>
  </Card>;

  return (<Grid container>
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(error => renderErrorMessage(error.message))}
    {renderAddSeriesForm()}
    {shouldRedirect && <Redirect to="/guitar-series" />}
  </Grid>);
};

export default AddGuitarSeries;
