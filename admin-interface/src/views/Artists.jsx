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
import { Error as ErrorIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { HTTP_URL } from '../shared/hosts.js';
import { Redirect } from 'react-router-dom';

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

const ReMountHOC = (Component) => {
  const Remountable = (props) => {
    const [key, setKey] = useState(Math.random());
    const remount = () => setKey(Math.random());
    return <Component key={key} remount={remount} {...props}/>;
  };
  return Remountable;
};

const Artists = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  const [shouldRefetch, setShouldRefetch] = useState(false);
  const scheduleRefetch = () => setShouldRefetch(true);
  // cache fetched images for smooth re-render
  const [artists, setArtists] = useState([]);
  const setArtistsState = (artists) => {
    setArtists(artists.map(artist => ({ isEditMode: false, ...artist })));
  };

  const setArtistEditModeOn = (id) => {
    setArtists(artists.map(artist => ({
      ...artist,
      ...(artist.id === id ? { isEditMode: true } : {})
    })));
  };

  const setArtistEditModeOff = (id) => {
    setArtists(artists.map(artist => ({
      ...artist,
      ...(artist.id === id ? { isEditMode: false } : {})
    })));
  };

  const resetAfterFetch = () => {
    setShouldRefetch(false);
  };

  const artistsRequestState = useAsync(async () => {
    const { data: artists } = await axios.get('/artists');
    resetAfterFetch();
    setArtistsState(artists);
    return artists;
  }, [shouldRefetch]);

  const [saveArtistState, saveArtist] = useAsyncFn(async (id) => {
    console.log(id);
  }, []);

  const [deleteArtistState, deleteArtist] = useAsyncFn(async (id) => {
    const { data: deleteResult } = await axios.delete(
      '/artist',
      { data: { id } },
    );
    scheduleRefetch();
    return deleteResult;
  }, []);

  const handleSaveArtist = (id) => {
    setArtistEditModeOff(id);
    saveArtist(id);
  };

  const requestStates = [
    artistsRequestState,
    saveArtistState,
    deleteArtistState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const renderEditMode = (artist) => (<Card className={classes.card} key={artist.id}>
    <CardContent>
      <Grid container><TextField label='Order' defaultValue={artist.order} /></Grid>
      <Grid container><TextField label='Name' defaultValue={artist.name} /></Grid>
      <Grid container><TextField label='Description' defaultValue={artist.description} multiline /></Grid>
      <img src={`${HTTP_URL}/${artist.photo.name}`} className={classes.img} />
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSaveArtist(artist.id)}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteArtist(artist.id)}
      >
        Delete
      </Button>
    </CardActions >
  </Card>);

  const renderDisplayMode = (artist) => (<Card className={classes.card} key={artist.id}>
    <CardContent>
      <Typography>{`Order: ${artist.order}`}</Typography>
      <Typography>{`Name: ${artist.name}`}</Typography>
      <Typography>{`Description: ${artist.description}`}</Typography>
      <img src={`${HTTP_URL}/${artist.photo.name}`} className={classes.img} />
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setArtistEditModeOn(artist.id)}
      >
        Edit
      </Button>
    </CardActions >
  </Card>);

  const renderArtist = (artist) => artist.isEditMode ? renderEditMode(artist) : renderDisplayMode(artist);

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
    {artists.map(renderArtist)}
  </Grid>);
};

export default ReMountHOC(Artists);
