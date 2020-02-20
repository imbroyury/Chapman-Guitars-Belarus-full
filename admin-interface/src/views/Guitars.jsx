import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAsync, useAsyncFn } from 'react-use';
import {
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Remount } from '../HOC/Remount';
import useEditableCollection from '../hooks/useEditableCollection.js';
import { Spinner, ErrorSnackbar } from '../components';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const properties = [
  { label: 'Name', name: 'name', type: 'string' },
  { label: 'Uri', name: 'uri', type: 'string' },
  { label: 'Order', name: 'order', type: 'number' },
  { label: 'Tuners', name: 'tuners', type: 'string' },
  { label: 'Neck', name: 'neck', type: 'string' },
  { label: 'Fretboard', name: 'fretboard', type: 'string' },
  { label: 'Frets', name: 'frets', type: 'string' },
  { label: 'Scale length', name: 'scaleLength', type: 'number' },
  { label: 'Body', name: 'body', type: 'string' },
  { label: 'Neck pickup', name: 'neckPickup', type: 'string' },
  { label: 'Bridge pickup', name: 'bridgePickup', type: 'string' },
  { label: 'Bridge', name: 'bridge', type: 'string' },
  { label: 'Weight, g', name: 'weight', type: 'number' },
];

const Guitars = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  const [shouldFetch, setShouldFetch] = useState(true);
  const scheduleRefetch = () => setShouldFetch(true);
  const resetAfterFetch = () => setShouldFetch(false);

  const [
    setInitialGuitars,
    setGuitarEditModeOn,
    setGuitarEditModeOff,
    editGuitarProperty,
    guitars,
  ] = useEditableCollection();

  const [series, setSeries] = useState([]);
  console.log(series);
  const guitarsRequestState = useAsync(async () => {
    if (!shouldFetch) return;
    const { data: guitars } = await axios.get('/guitars');
    resetAfterFetch();
    setInitialGuitars(guitars);
    return guitars;
  }, [shouldFetch]);

  const seriesRequestState = useAsync(async () => {
    if (!shouldFetch) return;
    const { data: series } = await axios.get('/all-guitar-series');
    resetAfterFetch();
    setSeries(series);
    return series;
  }, [shouldFetch]);

  const [saveGuitarState, saveGuitar] = useAsyncFn(async (id) => {
    const guitar = guitars.find(series => series.id === id).edited;
    const editedProperties = properties.reduce((acc, property) => {
      acc[property.name] = guitar[property.name];
      return acc;
    }, {});
    const { data: saveResult } = await axios.post(
      '/guitar',
      { id, ...editedProperties, seriesId: guitar.seriesId },
    );
    scheduleRefetch();
    return saveResult;
  }, [guitars]);

  const [deleteGuitarState, deleteGuitar] = useAsyncFn(async (id) => {
    const { data: deleteResult } = await axios.delete(
      '/guitar',
      { data: { id } },
    );
    scheduleRefetch();
    return deleteResult;
  }, []);

  const handleSaveGuitar = (id) => {
    setGuitarEditModeOff(id);
    saveGuitar(id);
  };

  const requestStates = [
    seriesRequestState,
    guitarsRequestState,
    saveGuitarState,
    deleteGuitarState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const renderGuitarColor = guitarColor => (<Card className={classes.card} key={guitarColor.id}>
    <CardContent>
      <Typography>{`Id: ${guitarColor.id}`}</Typography>
    </CardContent>
  </Card>);

  const renderPropertyEditMode = (guitar, property) =>
    <Grid container key={property.name}>
      <TextField
        label={property.label}
        name={property.name}
        value={guitar[property.name]}
        type={property.type}
        onChange={editGuitarProperty(guitar.id)}
      />
    </Grid>;

  const renderEditMode = (guitar) => (<Card className={classes.card} key={guitar.id}>
    <CardContent>
      {properties.map(property => renderPropertyEditMode(guitar, property))}
      <Typography>Colors: </Typography>
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSaveGuitar(guitar.id)}
        disabled={isInteractionDisabled}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteGuitar(guitar.id)}
        disabled={isInteractionDisabled}
      >
        Delete
      </Button>
    </CardActions>
  </Card>);

  const renderPropertyDisplayMode = (guitar, property) =>
    <Typography key={property.name}>{`${property.label}: ${guitar[property.name]}`}</Typography>;

  const renderDisplayMode = (guitar) => (<Card className={classes.card} key={guitar.id}>
    <CardContent>
      {properties.map(property => renderPropertyDisplayMode(guitar, property))}
      <Typography>Colors: </Typography>
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setGuitarEditModeOn(guitar.id)} disabled={isInteractionDisabled}
      >
        Edit
      </Button>
    </CardActions>
  </Card>);

  const renderGuitar = (guitar) => guitar.isEditMode ?
    renderEditMode(guitar.edited) :
    renderDisplayMode(guitar.initial);

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    actionLabel='Reload'
    actionHandler={reloadHandler}
  />);

  return (<Grid container>
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(error => renderErrorMessage(error.message))}
    {guitars.map(renderGuitar)}
  </Grid>);
};

Guitars.propTypes = {
  remount: PropTypes.func,
};

export default Remount(Guitars);
