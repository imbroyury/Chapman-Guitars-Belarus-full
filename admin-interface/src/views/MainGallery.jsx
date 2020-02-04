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

const MainGallery = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  // cache fetched images for smooth re-render
  const [images, setImages] = useState([]);
  // input type='file'
  const [fileList, setFileList] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const handleChangeFileList = (e) => setFileList(e.target.files);

  const scheduleRefetch = () => setShouldRefetch(true);

  const resetAfterFetch = () => {
    setShouldRefetch(false);
    setFileList(null);
  };

  const imagesRequestState = useAsync(async () => {
    const { data: images } = await axios.get('/gallery-images');
    resetAfterFetch();
    setImages(images);
    return images;
  }, [shouldRefetch]);

  const [uploadImageState, uploadImage] = useAsyncFn(async () => {
    const formData = new FormData();
    const order = Math.max(...images.map(image => image.order), -1) + 1;
    formData.append('image', fileList[0]);
    formData.append('order', order);
    const { data: uploadResult } = await axios.put(
      '/gallery-image',
      formData,
    );
    scheduleRefetch();
    return uploadResult;
  }, [fileList]);

  const [deleteImageState, deleteImage] = useAsyncFn(async (id) => {
    const { data: deleteResult } = await axios.delete(
      '/gallery-image',
      { data: { id } },
    );
    scheduleRefetch();
    return deleteResult;
  }, []);

  const [changeImageOrderState, changeImageOrder] = useAsyncFn(async (id, order) => {
    const { data: changeResult } = await axios.post(
      '/gallery-image-order',
      { id, order },
    );
    scheduleRefetch();
    return changeResult;
  }, []);

  const requestStates = [
    imagesRequestState,
    uploadImageState,
    deleteImageState,
    changeImageOrderState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const isUploadDisabled = (fileList === null || fileList.length === 0) || isInteractionDisabled;

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
    <img src={`${HTTP_URL}/${image.Image.name}`} className={classes.img}/>
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
    {renderUploadInput()}
    {images.map(renderImage)}
  </Grid>);
};

export default ReMountHOC(MainGallery);
