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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { HTTP_URL } from '../shared/hosts.js';
import { Remount } from '../HOC/Remount';
import { ErrorSnackbar, Spinner } from '../components/index.js';
import useEditableCollection from '../hooks/useEditableCollection.js';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
  img: {
    maxWidth: '300px',
  },
});

const GalleryImages = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  const [shouldRefetch, setShouldRefetch] = useState(false);
  const scheduleRefetch = () => setShouldRefetch(true);
  const resetAfterFetch = () => {
    setShouldRefetch(false);
  };

  const [
    setInitialImages,
    setImageEditModeOn,
    setImageEditModeOff,
    editImageProperty,
    images,
  ] = useEditableCollection();

  const imagesRequestState = useAsync(async () => {
    const { data: images } = await axios.get('/gallery-images');
    resetAfterFetch();
    setInitialImages(images);
    return images;
  }, [shouldRefetch]);

  const [deleteImageState, deleteImage] = useAsyncFn(async (id) => {
    const { data: deleteResult } = await axios.delete(
      '/gallery-image',
      { data: { id } },
    );
    scheduleRefetch();
    return deleteResult;
  }, []);

  const [saveImageState, saveImage] = useAsyncFn(async (id) => {
    const { order } = images.find(image => image.id === id).edited;
    console.log(images);
    console.log(order);
    const { data: changeResult } = await axios.post(
      '/gallery-image',
      { id, order },
    );
    scheduleRefetch();
    return changeResult;
  }, [images]);

  const handleSaveImage = (id) => {
    setImageEditModeOff(id);
    saveImage(id);
  };

  const requestStates = [
    imagesRequestState,
    deleteImageState,
    saveImageState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const renderDisplayMode = (image) => (<Card className={classes.card} key={image.id}>
    <CardContent>
      <Typography>{`Order: ${image.order}`}</Typography>
    </CardContent>
    <img src={`${HTTP_URL}/${image.Image.name}`} className={classes.img} />
    <CardActions>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setImageEditModeOn(image.id)} disabled={isInteractionDisabled}
      >
        Edit
      </Button>
    </CardActions>
  </Card>);

  const renderEditMode = (image) => (<Card className={classes.card} key={image.id}>
    <CardContent>
      <TextField
        label="Order"
        defaultValue={image.order}
        name="order"
        type="number"
        disabled={isInteractionDisabled}
        onChange={editImageProperty(image.id)}
      />
    </CardContent>
    <img src={`${HTTP_URL}/${image.Image.name}`} className={classes.img} />
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSaveImage(image.id)}
        disabled={isInteractionDisabled}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteImage(image.id)} disabled={isInteractionDisabled}
      >
        Delete
      </Button>
    </CardActions>
  </Card>);

  const renderImage = (image) => image.isEditMode ?
    renderEditMode(image.edited) :
    renderDisplayMode(image.initial);

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    actionLabel='Reload'
    actionHandler={reloadHandler}
  />);

  return (<Grid container>
    {images.map(renderImage)}
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(error => renderErrorMessage(error.message))}
  </Grid>);
};

GalleryImages.propTypes = {
  remount: PropTypes.func,
};

export default Remount(GalleryImages);
