import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsync, useAsyncFn } from 'react-use';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Remount } from '../../HOC/Remount';
import { ErrorSnackbar, Spinner, EditProperty, DisplayProperty } from '../../components/index.js';
import useEditableCollection from '../../hooks/useEditableCollection.js';
import getImageUrl from '../../helpers/getImageUrl.js';
import { mainProperties } from './properties';
import { getRequest, deleteRequest, postRequest } from '../../services/NetworkService';

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

  const [shouldFetch, setShouldFetch] = useState(true);
  const scheduleRefetch = () => setShouldFetch(true);
  const resetAfterFetch = () => setShouldFetch(false);

  const [
    setInitialImages,
    setImageEditModeOn,
    setImageEditModeOff,
    editImageProperty,
    images,
    getEditedImagePropertiesPayload,
  ] = useEditableCollection();

  const imagesRequestState = useAsync(async () => {
    if (!shouldFetch) return;
    const { data: images } = await getRequest('/gallery-images');
    resetAfterFetch();
    setInitialImages(images);
    return images;
  }, [shouldFetch]);

  const [deleteImageState, deleteImage] = useAsyncFn(async (id) => {
    const { data: deleteResult } = await deleteRequest(
      '/gallery-image',
      { data: { id } },
    );
    scheduleRefetch();
    return deleteResult;
  }, []);

  const [saveImageState, saveImage] = useAsyncFn(async (id) => {
    const propertiesPayload = getEditedImagePropertiesPayload(
      id,
      mainProperties,
    );
    const { data: changeResult } = await postRequest(
      '/gallery-image',
      { id, ...propertiesPayload },
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

  const renderPropertyDisplayMode = (image, property) =>
    <DisplayProperty
      key={property.name}
      item={image}
      property={property}
    />;

  const renderDisplayMode = (image) => (<Card className={classes.card} key={image.id}>
    <CardContent>
      {mainProperties.map(property => renderPropertyDisplayMode(image, property))}
    </CardContent>
    <img alt='' src={getImageUrl(image.Image.name)} className={classes.img} />
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

  const renderPropertyEditMode = (image, property) =>
    <EditProperty
      key={property.name}
      item={image}
      property={property}
      onChange={editImageProperty(image.id)}
      disabled={isInteractionDisabled}
    />;

  const renderEditMode = (image) => (<Card className={classes.card} key={image.id}>
    <CardContent>
      {mainProperties.map(property => renderPropertyEditMode(image, property))}
    </CardContent>
    <img alt='' src={getImageUrl(image.Image.name)} className={classes.img} />
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

  const renderErrorMessage = (error) =>
    (<ErrorSnackbar
      open
      errorMessage={error.message}
      key={error.message}
      actionLabel='Reload'
      actionHandler={reloadHandler}
    />);

  return (<Grid container>
    {images.map(renderImage)}
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(renderErrorMessage)}
  </Grid>);
};

GalleryImages.propTypes = {
  remount: PropTypes.func,
};

export default Remount(GalleryImages);
