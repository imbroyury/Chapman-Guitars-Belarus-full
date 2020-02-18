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
import { Alert } from '@material-ui/lab';
import { Error as ErrorIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Remount } from '../HOC/Remount';
import useEditableCollection from '../hooks/useEditableCollection.js';

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
  const resetAfterFetch = () => {
    setShouldRefetch(false);
  };

  const [
    setInitialSeries,
    setSeriesEditModeOn,
    setSeriesEditModeOff,
    editSeriesProperty,
    series,
  ] = useEditableCollection();

  const seriesRequestState = useAsync(async () => {
    const { data: series } = await axios.get('/all-guitar-series');
    resetAfterFetch();
    setInitialSeries(series);
    return series;
  }, [shouldRefetch]);

  const [saveSeriesState, saveSeries] = useAsyncFn(async (id) => {
    const { name, uri, order } = series.find(series => series.id === id).edited;
    const { data: saveResult } = await axios.post(
      '/guitar-series',
      { id, name, uri, order },
    );
    scheduleRefetch();
    return saveResult;
  }, [series]);

  const [deleteSeriesState, deleteSeries] = useAsyncFn(async (id) => {
    const { data: deleteResult } = await axios.delete(
      '/guitar-series',
      { data: { id } },
    );
    scheduleRefetch();
    return deleteResult;
  }, []);

  const handleSaveSeries = (id) => {
    setSeriesEditModeOff(id);
    saveSeries(id);
  };

  const requestStates = [
    seriesRequestState,
    saveSeriesState,
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

  const renderEditMode = (series) => (<Card className={classes.card} key={series.id}>
    <CardContent>
      <Grid container><TextField label='Name' name="name" value={series.name} onChange={editSeriesProperty(series.id)}/></Grid>
      <Grid container><TextField label='Uri' name="uri" value={series.uri} onChange={editSeriesProperty(series.id)}/></Grid>
      <Grid container><TextField label='Order' name="order" type="number" value={series.order} onChange={editSeriesProperty(series.id)}/></Grid>
      <Typography>Guitars: </Typography>
      {series.Guitars.map(renderGuitar)}
      <Alert variant="outlined" severity="warning">
        Deleting guitar series will also delete all guitars associated with it!
      </Alert>
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSaveSeries(series.id)}
        disabled={isInteractionDisabled}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteSeries(series.id)}
        disabled={isInteractionDisabled}
      >
        Delete
      </Button>
    </CardActions>
  </Card>);

  const renderDisplayMode = (series) => (<Card className={classes.card} key={series.id}>
    <CardContent>
      <Typography>{`Name: ${series.name}`}</Typography>
      <Typography>{`Uri: ${series.uri}`}</Typography>
      <Typography>{`Order: ${series.order}`}</Typography>
      <Typography>Guitars: </Typography>
      {series.Guitars.map(renderGuitar)}
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setSeriesEditModeOn(series.id)} disabled={isInteractionDisabled}
      >
        Edit
      </Button>
    </CardActions>
  </Card>);

  const renderSeries = (series) => series.isEditMode ?
    renderEditMode(series.edited) :
    renderDisplayMode(series.initial);

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
