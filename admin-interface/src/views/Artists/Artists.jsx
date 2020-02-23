import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAsync, useAsyncFn } from 'react-use';
import useEditableCollection from '../../hooks/useEditableCollection.js';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Spinner, ErrorSnackbar, EditProperty, DisplayProperty } from '../../components';
import { Remount } from '../../HOC/Remount';
import getImageUrl from '../../helpers/getImageUrl.js';
import { mainProperties } from './properties';

const useStyles = makeStyles({
  card: {
    margin: '10px',
    width: '100%',
  },
  img: {
    maxWidth: '300px',
  },
});

const Artists = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  const [shouldFetch, setShouldFetch] = useState(true);
  const scheduleRefetch = () => setShouldFetch(true);
  const resetAfterFetch = () => setShouldFetch(false);

  const [
    setInitialArtists,
    setArtistEditModeOn,
    setArtistEditModeOff,
    editArtistProperty,
    artists,
    getEditedArtistPropertiesPayload,
  ] = useEditableCollection();

  const artistsRequestState = useAsync(async () => {
    if (!shouldFetch) return;
    const { data: artists } = await axios.get('/artists');
    resetAfterFetch();
    setInitialArtists(artists);
    return artists;
  }, [shouldFetch]);

  const [saveArtistState, saveArtist] = useAsyncFn(async (id) => {
    const propertiesPayload = getEditedArtistPropertiesPayload(
      id,
      mainProperties,
    );
    const { data: saveResult } = await axios.post(
      '/artist',
      { id, ...propertiesPayload },
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

  const renderPropertyEditMode = (artist, property) =>
    <EditProperty
      key={property.name}
      item={artist}
      property={property}
      onChange={editArtistProperty(artist.id)}
      disabled={isInteractionDisabled}
    />;

  const renderEditMode = (artist) => (<Card className={classes.card} key={artist.id}>
    <CardContent>
      {mainProperties.map(property => renderPropertyEditMode(artist, property))}
      <img alt='' src={getImageUrl(artist.photo.name)} className={classes.img} />
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

  const renderPropertyDisplayMode = (artist, property) =>
    <DisplayProperty
      key={property.name}
      item={artist}
      property={property}
    />;

  const renderDisplayMode = (artist) => (<Card className={classes.card} key={artist.id}>
    <CardContent>
      {mainProperties.map(property => renderPropertyDisplayMode(artist, property))}
      <img alt='' src={getImageUrl(artist.photo.name)} className={classes.img} />
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
    actionLabel='Reload'
    actionHandler={reloadHandler}
  />);

  return (<Grid container>
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(error => renderErrorMessage(error.message))}
    {artists.map(renderArtist)}
  </Grid>);
};

Artists.propTypes = {
  remount: PropTypes.func,
};

export default Remount(Artists);
