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
import { Remount } from '../HOC/Remount';
import { Redirect } from 'react-router-dom';
import { ErrorSnackbar, Spinner, FileInput } from '../components/index.js';

const useStyles = makeStyles({
  paper: {
    padding: '20px',
  },
  card: {
    margin: '10px',
  },
  img: {
    maxWidth: '300px',
  },
  reloadButton: {
    color: 'white'
  }
});

const AddGalleryImage = () => {
  const classes = useStyles();

  const [shouldRedirect, setShouldRedirect] = useState(false);

  // input type='file'
  const [fileList, setFileList] = useState(null);
  const handleChangeFileList = (e) => setFileList(e.target.files);

  const [order, setOrder] = useState(0);
  const handleChangeOrder = (e) => setOrder(e.target.value);

  const [uploadImageState, uploadImage] = useAsyncFn(async () => {
    const formData = new FormData();
    formData.append('image', fileList[0]);
    formData.append('order', order);
    const { data: uploadResult } = await axios.put(
      '/gallery-image',
      formData,
    );
    setShouldRedirect(true);
    return uploadResult;
  }, [fileList, order]);


  const requestStates = [
    uploadImageState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const isUploadDisabled = (fileList === null || fileList.length === 0) || isInteractionDisabled;

  const renderUploadInput = () =>
    <FileInput
      label="Select image to upload"
      onChange={handleChangeFileList}
      disabled={isInteractionDisabled}
      fileList={fileList}
    />;

  const renderAddImageForm = () => <Card className={classes.card}>
    <CardContent>
      {renderUploadInput()}
      <Grid container><TextField label='Order' name="order" type="number" value={order} onChange={handleChangeOrder} /></Grid>
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

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    action={
      <Button onClick={uploadImage} size="small" className={classes.reloadButton}>Retry</Button>
    }
  />);

  return (<Grid container>
    {renderAddImageForm()}
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(error => renderErrorMessage(error.message))}
    {shouldRedirect && <Redirect to="/gallery-images" />}
  </Grid>);
};

export default Remount(AddGalleryImage);
