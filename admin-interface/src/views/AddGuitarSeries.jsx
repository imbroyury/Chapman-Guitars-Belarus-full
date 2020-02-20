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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { Spinner, ErrorSnackbar } from '../components';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

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

  const isAddDisabled = isInteractionDisabled ||
    [series.name, series.uri, series.order].some(value => value === '');

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    actionLabel='Retry'
    actionHandler={addSeries}
  />);

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
