import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAsyncFn, useAsync } from 'react-use';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Spinner, ErrorSnackbar, EditProperty, LabelledSelect } from '../../components';
import { mainProperties, additionalProperties } from './properties';
import useItemFormState from '../../hooks/useItemFormState';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
  input: {
    width: '18rem'
  },
});

const AddGuitar = () => {
  const classes = useStyles();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [guitar, handleChangeProperty, isGuitarValid] = useItemFormState(mainProperties, additionalProperties);

  const [series, setSeries] = useState([]);
  const guitarSeriesState = useAsync(async () => {
    const { data: guitarSeries } = await axios.get('/all-guitar-series');
    const series = guitarSeries.map(series => ({ id: series.id, name: series.name }));
    setSeries(series);
    return series;
  }, []);

  const [addGuitarState, addGuitar] = useAsyncFn(async () => {
    const { data: uploadResult } = await axios.put(
      '/guitar',
      guitar,
    );

    setShouldRedirect(true);
    return uploadResult;
  }, [guitar]);

  const requestStates = [
    addGuitarState,
    guitarSeriesState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const isInteractionDisabled = isSomeRequestInProgress;

  const isAddDisabled = isInteractionDisabled || !isGuitarValid;

  const renderErrorMessage = (error) =>
    <ErrorSnackbar
      open
      errorMessage={error.message}
      key={error.message}
      actionLabel='Retry'
      actionHandler={addGuitar}
    />;

  const renderPropertyEditMode = (property) =>
    <EditProperty
      key={property.name}
      item={guitar}
      property={property}
      onChange={handleChangeProperty}
      inputClassName={classes.input}
    />;

  const renderSeriesSelect = () => {
    return (<LabelledSelect
      options={series}
      name="seriesId"
      label="Series"
      value={guitar.seriesId}
      onChange={handleChangeProperty}
      className={classes.input}
    />);
  };

  const renderAddGuitarForm = () => <Card className={classes.card}>
    <CardContent>
      {mainProperties.map(renderPropertyEditMode)}
      {renderSeriesSelect()}
      <Alert variant="outlined" severity="info">
        You can add a color later in Guitars section
      </Alert>
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={addGuitar}
        disabled={isAddDisabled}
      >
        Add
      </Button>
    </CardActions>
  </Card>;

  return (<Grid container>
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(renderErrorMessage)}
    {renderAddGuitarForm()}
    {shouldRedirect && <Redirect to="/guitars" />}
  </Grid>);
};

AddGuitar.propTypes = {
  remount: PropTypes.func,
};

export default AddGuitar;
