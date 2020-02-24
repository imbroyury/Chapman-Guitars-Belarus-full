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
import { Remount } from '../../HOC/Remount';
import { Redirect } from 'react-router-dom';
import { ErrorSnackbar, Spinner, FileInput, EditProperty } from '../../components/index.js';
import useItemFormState from '../../hooks/useItemFormState';
import { mainProperties } from './properties';
import { putRequest } from '../../services/NetworkService';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const AddGalleryImage = () => {
  const classes = useStyles();

  const [shouldRedirect, setShouldRedirect] = useState(false);

  // input type='file'
  const [fileList, setFileList] = useState(null);
  const handleChangeFileList = (e) => setFileList(e.target.files);

  const [image, handleChangeProperty, isImageValid] = useItemFormState(mainProperties);

  const [uploadImageState, uploadImage] = useAsyncFn(async () => {
    const formData = new FormData();
    formData.append('image', fileList[0]);
    mainProperties
      .map(prop => prop.name)
      .forEach(prop => formData.append(prop, image[prop]));

    const { data: uploadResult } = await putRequest(
      '/gallery-image',
      formData,
    );
    setShouldRedirect(true);
    return uploadResult;
  }, [fileList, image]);


  const requestStates = [
    uploadImageState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const isUploadDisabled = (fileList === null || fileList.length === 0) ||
    isInteractionDisabled ||
    !isImageValid;

  const renderUploadInput = () =>
    <FileInput
      label="Select image to upload"
      onChange={handleChangeFileList}
      disabled={isInteractionDisabled}
      fileList={fileList}
    />;

  const renderPropertyEditMode = (property) =>
    <EditProperty
      key={property.name}
      item={image}
      property={property}
      onChange={handleChangeProperty}
    />;

  const renderAddImageForm = () => <Card className={classes.card}>
    <CardContent>
      {renderUploadInput()}
      {mainProperties.map(renderPropertyEditMode)}
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        onClick={uploadImage}
        color="primary"
        disabled={isUploadDisabled}
      >
        Add
      </Button>
    </CardActions>
  </Card>;

  const renderErrorMessage = (error) =>
    <ErrorSnackbar
      open
      errorMessage={error.message}
      key={error.message}
      actionLabel='Retry'
      actionHandler={uploadImage}
    />;

  return (<Grid container>
    {renderAddImageForm()}
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(renderErrorMessage)}
    {shouldRedirect && <Redirect to="/gallery-images" />}
  </Grid>);
};

export default Remount(AddGalleryImage);
