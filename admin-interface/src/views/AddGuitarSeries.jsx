import React, { useState } from 'react';
import axios from 'axios';
import { useAsyncFn } from 'react-use';
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
import { Redirect } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

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

const AddGuitarSeries = () => {
  const classes = useStyles();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [series, setSeries] = useState({
    name: '',
    uri: '',
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
    const { name, uri } = series;
    const { data: uploadResult } = await axios.put(
      '/guitar-series',
      { name, uri },
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

  const isAddDisabled = isInteractionDisabled || series.name === '' || series.uri === '';

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
          <Button onClick={addSeries} size="small" className={classes.reloadButton}>Retry</Button>
        }
      />
    </Snackbar>);

  const renderAddArtistForm = () => <Card className={classes.card}>
    <CardContent>
      <Grid container><TextField label='Name' name="name" value={series.name} onChange={handleChangeInput}/></Grid>
      <Grid container><TextField label='Uri' name="uri" value={series.order} onChange={handleChangeInput}/></Grid>
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
    {isSomeRequestInProgress &&
      <Dialog open>
        <DialogContent><CircularProgress /></DialogContent>
      </Dialog>}
    {requestErrors.map(error => renderErrorMessage(error.message))}
    {renderAddArtistForm()}
    {shouldRedirect && <Redirect to="/guitar-series" />}
  </Grid>);
};

export default AddGuitarSeries;
