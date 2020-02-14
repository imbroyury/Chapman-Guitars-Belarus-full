import React, { useState } from 'react';
import axios from 'axios';
import { useAsync, useAsyncFn } from 'react-use';
import {
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogContent,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import { Error as ErrorIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { HTTP_URL } from '../shared/hosts.js';
import { Redirect } from 'react-router-dom';
import { Remount } from '../HOC/Remount';

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

const GuitarSeries = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  const [shouldRefetch, setShouldRefetch] = useState(false);
  const scheduleRefetch = () => setShouldRefetch(true);
  // cache fetched images for smooth re-render
  const [series, setSeries] = useState([]);

  const resetAfterFetch = () => {
    setShouldRefetch(false);
  };

  const seriesRequestState = useAsync(async () => {
    const { data: series } = await axios.get('/all-guitar-series');
    resetAfterFetch();
    setSeries(series);
    console.log(series);
    return series;
  }, [shouldRefetch]);

  const [deleteSeriesState, deleteSeries] = useAsyncFn(async (id) => {
    const { data: deleteResult } = await axios.delete(
      '/guitar-series',
      { data: { id } },
    );
    scheduleRefetch();
    return deleteResult;
  }, []);


  const requestStates = [
    seriesRequestState,
    deleteSeriesState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const renderGuitar = guitar => (<Card className={classes.card} key={guitar.id}>
    <CardContent>
      <Typography>{`Id: ${guitar.id}`}</Typography>
      <Typography>{`Name: ${guitar.name}`}</Typography>
    </CardContent>
  </Card>);

  const renderSeries = (series) => (<Card className={classes.card} key={series.id}>
    <CardContent>
      <Typography>{`Id: ${series.id}`}</Typography>
      <Typography>{`Name: ${series.name}`}</Typography>
      <Typography>{`Uri: ${series.uri}`}</Typography>
      <Typography>Guitars: </Typography>
      {series.Guitars.map(renderGuitar)}
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteSeries(series.id)} disabled={isInteractionDisabled}
      >
        Delete
      </Button>
    </CardActions>
  </Card>);

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
          <Button onClick={reloadHandler} size="small" className={classes.reloadButton}>Reload</Button>
        }
      />
    </Snackbar>);

  return (<Grid container>
    {isSomeRequestInProgress &&
      <Dialog open>
        <DialogContent><CircularProgress /></DialogContent>
      </Dialog>}
    {requestErrors.map(error => renderErrorMessage(error.message))}
    {series.map(renderSeries)}
  </Grid>);
};

export default Remount(GuitarSeries);
