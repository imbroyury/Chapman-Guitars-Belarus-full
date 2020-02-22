import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAsync, useAsyncFn } from 'react-use';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import { Remount } from '../../HOC/Remount';
import useEditableCollection from '../../hooks/useEditableCollection.js';
import { Spinner, ErrorSnackbar, EditProperty, DisplayProperty, LabelledSelect } from '../../components';
import getImageUrl from '../../helpers/getImageUrl';
import { mainProperties, additionalProperties } from './properties';

const useStyles = makeStyles({
  card: {
    margin: '1rem',
  },
  textField: {
    width: '18rem'
  },
  colorCard: {
    margin: '1rem',
    padding: '0.5rem',
    maxWidth: '9rem',
  },
  guitarImg: {
    maxWidth: '6rem',
  },
  tabImage: {
    width: '5rem',
    borderRadius: '1rem',
  },
  dotImage: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
  }
});

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
    getEditedGuitarPropertiesPayload,
  ] = useEditableCollection();

  const [series, setSeries] = useState([]);

  const guitarsGroupedBySeriesRequestState = useAsync(async () => {
    if (!shouldFetch) return;
    const { data: guitarsGroupedBySeries } = await axios.get('/guitars');
    const guitars = guitarsGroupedBySeries.flatMap(series => series.Guitars);
    const series = guitarsGroupedBySeries.map(series => ({ id: series.id, name: series.name }));
    resetAfterFetch();
    setSeries(series);
    setInitialGuitars(guitars);
    return guitarsGroupedBySeries;
  }, [shouldFetch]);

  const [saveGuitarState, saveGuitar] = useAsyncFn(async (id) => {
    const propertiesPayload = getEditedGuitarPropertiesPayload(
      id,
      mainProperties,
      additionalProperties,
    );

    const { data: saveResult } = await axios.post(
      '/guitar',
      { id, ...propertiesPayload },
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
    return (<Card key={guitar} className={classes.colorCard} raised>
      <Grid>
        <img alt='' src={getImageUrl(tab)} className={classes.tabImage} />
        <img alt='' src={getImageUrl(dot)} className={classes.dotImage} />
      </Grid>
      <Grid>
        <img alt='' src={getImageUrl(guitar)} className={classes.guitarImg} />
      </Grid>
    </Card>);
  };

  const renderGuitarColors = (guitarColors) => <Grid container>{guitarColors.map(renderGuitarColor)}</Grid>;

  const renderPropertyEditMode = (guitar, property) =>
    <EditProperty
      key={property.name}
      item={guitar}
      property={property}
      onChange={editGuitarProperty(guitar.id)}
      inputClassName={classes.textField}
    />;

  const renderEditMode = (guitar) => {
    const currentSeries = series.find(series => series.id === guitar.seriesId);

    const renderSeriesSelect = () => {
      return (<LabelledSelect
        options={series}
        name="seriesId"
        label="Series"
        value={currentSeries.id}
        onChange={editGuitarProperty(guitar.id)}
        className={classes.input}
      />);
    };
    return (<Card className={classes.card} key={guitar.id}>
      <CardContent>
        {mainProperties.map(property => renderPropertyEditMode(guitar, property))}
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
        <Button
          variant="contained"
          color="primary"
          component={NavLink}
          to={`/add-guitar-color/${guitar.id}`}
          disabled={isInteractionDisabled}
        >
          Add color
        </Button>
      </CardActions>
    </Card>);
  };

  const renderPropertyDisplayMode = (guitar, property) =>
    <DisplayProperty
      key={property.name}
      item={guitar}
      property={property}
    />;

  const renderDisplayMode = (guitar) => {
    const currentSeries = series.find(series => series.id === guitar.seriesId);

    return (<Card className={classes.card} key={guitar.id}>
      <CardContent>
        {mainProperties.map(property => renderPropertyDisplayMode(guitar, property))}
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
