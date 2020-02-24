import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsync, useAsyncFn } from 'react-use';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Remount } from '../../HOC/Remount';
import useEditableCollection from '../../hooks/useEditableCollection.js';
import { Spinner, ErrorSnackbar, EditProperty, DisplayProperty } from '../../components';
import { mainProperties } from './properties';
import { getRequest, postRequest, deleteRequest } from '../../services/NetworkService';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const GuitarSeries = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  const [shouldFetch, setShouldFetch] = useState(true);
  const scheduleRefetch = () => setShouldFetch(true);
  const resetAfterFetch = () => setShouldFetch(false);

  const [
    setInitialSeries,
    setSeriesEditModeOn,
    setSeriesEditModeOff,
    editSeriesProperty,
    series,
  ] = useEditableCollection();

  const seriesRequestState = useAsync(async () => {
    if (!shouldFetch) return;
    const { data: series } = await getRequest('/all-guitar-series');
    resetAfterFetch();
    setInitialSeries(series);
    return series;
  }, [shouldFetch]);

  const [saveSeriesState, saveSeries] = useAsyncFn(async (id) => {
    const { name, uri, order } = series.find(series => series.id === id).edited;
    const { data: saveResult } = await postRequest(
      '/guitar-series',
      { id, name, uri, order },
    );
    scheduleRefetch();
    return saveResult;
  }, [series]);

  const [deleteSeriesState, deleteSeries] = useAsyncFn(async (id) => {
    const { data: deleteResult } = await deleteRequest(
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

  const renderPropertyEditMode = (guitarSeries, property) =>
    <EditProperty
      key={property.name}
      item={guitarSeries}
      property={property}
      onChange={editSeriesProperty(guitarSeries.id)}
      disabled={isInteractionDisabled}
    />;

  const renderEditMode = (series) => (<Card className={classes.card} key={series.id}>
    <CardContent>
      {mainProperties.map(property => renderPropertyEditMode(series, property))}
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


  const renderPropertyDisplayMode = (series, property) =>
    <DisplayProperty
      key={property.name}
      item={series}
      property={property}
    />;

  const renderDisplayMode = (series) => (<Card className={classes.card} key={series.id}>
    <CardContent>
      {mainProperties.map(property => renderPropertyDisplayMode(series, property))}
      <Typography>Guitars: </Typography>
      {series.Guitars.map(renderGuitar)}
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setSeriesEditModeOn(series.id)}
        disabled={isInteractionDisabled}
      >
        Edit
      </Button>
    </CardActions>
  </Card>);

  const renderSeries = (series) => series.isEditMode ?
    renderEditMode(series.edited) :
    renderDisplayMode(series.initial);

  const renderErrorMessage = (error) =>
    <ErrorSnackbar
      open
      errorMessage={error.message}
      key={error.message}
      actionLabel='Reload'
      actionHandler={reloadHandler}
    />;

  return (<Grid container>
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(renderErrorMessage)}
    {series.map(renderSeries)}
  </Grid>);
};

GuitarSeries.propTypes = {
  remount: PropTypes.func,
};

export default Remount(GuitarSeries);
