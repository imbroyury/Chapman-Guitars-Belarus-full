import React, { useState } from 'react';
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
import { putRequest } from '../../services/NetworkService';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const AddPage = () => {
  const classes = useStyles();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [series, handleChangeProperty, isSeriesValid] = useItemFormState(mainProperties);

  const [addPageState, addSeries] = useAsyncFn(async () => {
    const { data: uploadResult } = await putRequest(
      '/page',
      series,
    );
    setShouldRedirect(true);
    return uploadResult;
  }, [series]);

  const requestStates = [
    addPageState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const isInteractionDisabled = isSomeRequestInProgress;

  const isAddDisabled = isInteractionDisabled || !isSeriesValid;

  const renderErrorMessage = (error) =>
    (<ErrorSnackbar
      open
      errorMessage={error.message}
      key={error.message}
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

  const renderAddPageForm = () => <Card className={classes.card}>
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
    {requestErrors.map(renderErrorMessage)}
    {renderAddPageForm()}
    {shouldRedirect && <Redirect to="/pages" />}
  </Grid>);
};

export default AddPage;
