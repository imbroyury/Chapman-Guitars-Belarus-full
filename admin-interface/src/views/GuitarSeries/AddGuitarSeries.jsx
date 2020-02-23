import React, { useState } from 'react';
import axios from 'axios';
import { useAsyncFn } from 'react-use';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Spinner, ErrorSnackbar, EditProperty } from '../../components';
import useItemFormState from '../../hooks/useItemFormState';
import { mainProperties } from './properties';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const AddGuitarSeries = () => {
  const classes = useStyles();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [series, handleChangeProperty, isSeriesValid] = useItemFormState(mainProperties);

  const [addSeriesState, addSeries] = useAsyncFn(async () => {
    const { data: uploadResult } = await axios.put(
      '/guitar-series',
      series,
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

  const isAddDisabled = isInteractionDisabled || !isSeriesValid;

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    actionLabel='Retry'
    actionHandler={addSeries}
  />);

  const renderPropertyEditMode = (property) =>
    <EditProperty
      key={property.name}
      item={series}
      property={property}
      onChange={handleChangeProperty}
      inputClassName={classes.input}
    />;

  const renderAddSeriesForm = () => <Card className={classes.card}>
    <CardContent>
      {mainProperties.map(renderPropertyEditMode)}
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
