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
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Remount } from '../HOC/Remount';
import useEditableCollection from '../hooks/useEditableCollection.js';
import { Spinner, ErrorSnackbar } from '../components';
import getImageUrl from '../helpers/getImageUrl';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
  img: {
    maxWidth: '100px',
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

  const guitarsGroupedBySeriesRequestState = useAsync(async () => {
    if (!shouldFetch) return;
    const { data: guitarsGroupedBySeries } = await axios.get('/guitars');
    const guitars = guitarsGroupedBySeries.flatMap(series => series.Guitars);
    const series = guitarsGroupedBySeries.map(series => ({ id: series.id, name: series.name }));
    console.log(guitars);
    console.log(series);
    resetAfterFetch();
    setSeries(series);
    setInitialGuitars(guitars);
    return guitarsGroupedBySeries;
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
    guitarsGroupedBySeriesRequestState,
    saveGuitarState,
    deleteGuitarState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const renderGuitarColor = guitarColor => {
    const guitar = guitarColor.guitarImage.name;
    const tab = guitarColor.tabImage.name;
    const dot = guitarColor.dotImage.name;
    return (<Grid key={guitar}>
      <img src={getImageUrl(guitar)} className={classes.img} />
      <img src={getImageUrl(tab)} className={classes.img} />
      <img src={getImageUrl(dot)} className={classes.img} />
    </Grid>);
  };

  const renderGuitarColors = (guitarColors) => guitarColors.map(renderGuitarColor);

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

  const renderEditMode = (guitar) => {
    const currentSeries = series.find(series => series.id === guitar.seriesId);

    const renderSeriesSelect = () => <Select
      name="seriesId"
      value={currentSeries.id}
      onChange={editGuitarProperty(guitar.id)}
    >
      {series.map(
        currentSeries =>
          <MenuItem
            value={currentSeries.id}
            key={currentSeries.id}
          >
            {currentSeries.name}
          </MenuItem>
      )}
    </Select>;

    return (<Card className={classes.card} key={guitar.id}>
      <CardContent>
        {properties.map(property => renderPropertyEditMode(guitar, property))}
        {renderSeriesSelect()}
        <Typography>Colors: </Typography>
        {renderGuitarColors(guitar.GuitarColors)}
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
  };

  const renderPropertyDisplayMode = (guitar, property) =>
    <Typography key={property.name}>{`${property.label}: ${guitar[property.name]}`}</Typography>;

  const renderDisplayMode = (guitar) => {
    const currentSeries = series.find(series => series.id === guitar.seriesId);

    return (<Card className={classes.card} key={guitar.id}>
      <CardContent>
        {properties.map(property => renderPropertyDisplayMode(guitar, property))}
        <Typography>{`Series: ${currentSeries.name}`}</Typography>
        <Typography>Colors: </Typography>
      </CardContent>
      {renderGuitarColors(guitar.GuitarColors)}
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
  };


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
