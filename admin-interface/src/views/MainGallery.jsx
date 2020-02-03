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
  }
}));

const MainGallery = (props) => {
  const classes = useStyles();

  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  const disableInteraction = () => setIsInteractionDisabled(true);
  const enableInteraction = () => setIsInteractionDisabled(false);

  // cache fetched images for smooth re-render
  const [images, setImages] = useState([]);
  const [fileList, setFileList] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const handleChangeFileList = (e) => setFileList(e.target.files);

  const resetAfterFetch = () => {
    setShouldRefetch(false);
    setFileList(null);
  };

  const scheduleRefetch = () => setShouldRefetch(true);

  const imagesRequestState = useAsync(async () => {
    disableInteraction();
    const { data: images } = await axios.get('/gallery-images');
    resetAfterFetch();
    enableInteraction();
    setImages(images);
    return images;
  }, [shouldRefetch]);

  const [uploadImageState, uploadImage] = useAsyncFn(async () => {
    disableInteraction();
    const formData = new FormData();
    const order = Math.max(...images.map(image => image.order), -1) + 1;
    formData.append('image', fileList[0]);
    formData.append('order', order);
    const { data: uploadResult } = await axios.put(
      '/gallery-image',
      formData,
    );
    scheduleRefetch();
    enableInteraction();
    return uploadResult;
  }, [fileList]);

  const [deleteImageState, deleteImage] = useAsyncFn(async (id) => {
    disableInteraction();
    const { data: deleteResult } = await axios.delete(
      '/gallery-image',
      { data: { id } },
    );
    scheduleRefetch();
    enableInteraction();
    return deleteResult;
  }, []);

  const [changeImageOrderState, changeImageOrder] = useAsyncFn(async (id, order) => {
    disableInteraction();
    const { data: changeResult } = await axios.post(
      '/gallery-image-order',
      { id, order },
    );
    scheduleRefetch();
    enableInteraction();
    return changeResult;
  }, []);

  const renderImage = (image) => (<Card className={classes.card} key={image.id}>
    <CardContent>
      <Typography>{`Id: ${image.id}`}</Typography>
      <TextField
        label="Order"
        defaultValue={image.order}
        type="number"
        disabled={isInteractionDisabled}
        onBlur={(e) => {
          const { value } = e.target;
          if (value !== image.order) changeImageOrder(image.id, e.target.value);
        }}
      />
    </CardContent>
    <img src={`${HTTP_URL}/${image.image.name}`} className={classes.img}/>
    <CardActions>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteImage(image.id)} disabled={isInteractionDisabled}
      >
        Delete
      </Button>
    </CardActions>
  </Card>);

  const renderUploadMessage = () => (fileList === null || fileList.length === 0)
    ? <Typography>No file chosen</Typography>
    : <Typography variant="overline" className={classes.fileLabel}>{fileList[0].name}</Typography>;

  const isUploadDisabled = (fileList === null || fileList.length === 0) || isInteractionDisabled;

  const renderUploadInput = () => <>
    <Grid container>
      <Button
        variant="contained"
        component="label"
        disabled={isInteractionDisabled}
      >
      Select image to upload
        <input
          type="file"
          className={classes.uploadInput}
          onChange={handleChangeFileList}
        />
      </Button><br/>
      {renderUploadMessage()}
    </Grid>
    <Grid container>
      <Button
        variant="contained"
        onClick={uploadImage}
        color="primary"
        disabled={isUploadDisabled}
      >
      Upload
      </Button>
    </Grid>
  </>;

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
      />
    </Snackbar>);

  return (<Grid container>
    {
      [
        imagesRequestState,
        uploadImageState,
        deleteImageState,
        changeImageOrderState,
      ].map(state => state.error ? renderErrorMessage(state.error.message) : null)
    }
    {renderUploadInput()}
    {imagesRequestState.loading && <Grid container><CircularProgress /></Grid>}
    {images.map(renderImage)}
  </Grid>);
};

export default MainGallery;
