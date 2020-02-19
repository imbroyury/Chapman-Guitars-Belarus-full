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
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { HTTP_URL } from '../shared/hosts.js';
import { Redirect } from 'react-router-dom';
import { Remount } from '../HOC/Remount';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useEditableCollection from '../hooks/useEditableCollection.js';
import Spinner from '../components/Spinner.jsx';
import { ErrorSnackbar } from '../components/index.js';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '20px',
  },
  card: {
    margin: '10px',
    width: '100%',
  },
  img: {
    maxWidth: '300px',
  },
  uploadInput: {
    display: 'none'
  },
  reloadButton: {
    color: 'white'
  },
  descriptonHTML: {
    fontFamily: theme.typography.fontFamily
  }
}));

const Artists = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  const [shouldRefetch, setShouldRefetch] = useState(false);
  const scheduleRefetch = () => setShouldRefetch(true);
  const resetAfterFetch = () => {
    setShouldRefetch(false);
  };

  const [
    setInitialArtists,
    setArtistEditModeOn,
    setArtistEditModeOff,
    editArtistProperty,
    artists,
  ] = useEditableCollection();

  const handleEditArtistDescription = (id) => (content) => {
    // emulate event interface not to duplicate code in handleEditArtistInput
    const e = { target: { name: 'description', value: content } };
    editArtistProperty(id)(e);
  };

  const artistsRequestState = useAsync(async () => {
    const { data: artists } = await axios.get('/artists');
    resetAfterFetch();
    setInitialArtists(artists);
    return artists;
  }, [shouldRefetch]);

  const [saveArtistState, saveArtist] = useAsyncFn(async (id) => {
    const { order, name, description } = artists.find(artist => artist.id === id).edited;
    const { data: saveResult } = await axios.post(
      '/artist',
      { id, order, name, description },
    );
    scheduleRefetch();
    return saveResult;
  }, [artists]);

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
      <Grid container><TextField label='Order' name="order" type="number" value={artist.order} onChange={editArtistProperty(artist.id)}/></Grid>
      <Grid container><TextField label='Name' name="name" value={artist.name} onChange={editArtistProperty(artist.id)}/></Grid>
      <ReactQuill
        value={artist.description}
        onChange={handleEditArtistDescription(artist.id)}
        readOnly={isInteractionDisabled}
      />
      <img src={`${HTTP_URL}/${artist.photo.name}`} className={classes.img} />
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSaveArtist(artist.id)}
        disabled={isInteractionDisabled}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteArtist(artist.id)}
        disabled={isInteractionDisabled}
      >
        Delete
      </Button>
    </CardActions>
  </Card>);

  const renderDisplayMode = (artist) => (<Card className={classes.card} key={artist.id}>
    <CardContent>
      <Typography>{`Order: ${artist.order}`}</Typography>
      <Typography>{`Name: ${artist.name}`}</Typography>
      <Typography>Description:</Typography><div dangerouslySetInnerHTML={{ __html: artist.description}} className={classes.descriptonHTML}></div>
      <img src={`${HTTP_URL}/${artist.photo.name}`} className={classes.img} />
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setArtistEditModeOn(artist.id)}
        disabled={isInteractionDisabled}
      >
        Edit
      </Button>
    </CardActions >
  </Card>);

  const renderArtist = (artist) => artist.isEditMode ?
    renderEditMode(artist.edited) :
    renderDisplayMode(artist.initial);

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    action={
      <Button onClick={reloadHandler} size="small" className={classes.reloadButton}>Reload</Button>
    }
  />);

  return (<Grid container>
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(error => renderErrorMessage(error.message))}
    {artists.map(renderArtist)}
  </Grid>);
};

export default Remount(Artists);
