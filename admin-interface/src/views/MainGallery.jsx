import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAsync, useAsyncFn } from 'react-use';
import {
  Grid,
  Paper,
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

  const [fileList, setFileList] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const handleChangeFileList = (e) => setFileList(e.target.files);

  const resetAfterFetch = () => {
    setShouldRefetch(false);
    setFileList(null);
  };

  const scheduleRefetch = () => setShouldRefetch(true);

  const imagesRequestState = useAsync(async () => {
    const { data: images } = await axios.get('/gallery-images');
    resetAfterFetch();
    return images;
  }, [shouldRefetch]);

  const [uploadImageState, uploadImage] = useAsyncFn(async () => {
    const formData = new FormData();
    formData.append('image', fileList[0]);
    formData.append('order', imagesRequestState.value.length);
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
    const { data: deleteResult } = await axios.post(
      '/gallery-image-order',
      { id, order },
    );
    scheduleRefetch();
    return deleteResult;
  }, []);

  const renderGetError = () => (<Paper className={classes.paper}>
    <Typography variant="h4">Error while fetching images</Typography>
  </Paper>);

  const renderImage = (image) => (<Card className={classes.card} key={image.id}>
    <CardContent>
      <Typography>{`Image id: ${image.id}`}</Typography>
      <TextField
        label="Image order"
        defaultValue={image.order}
        onBlur={(e) => {
          const { value } = e.target;
          if (value === image.order) return;
          changeImageOrder(image.id, e.target.value);
        }}
      />
    </CardContent>
    <img src={`${HTTP_URL}/${image.image.name}`} className={classes.img}/>
    <CardActions>
      <Button variant="contained" color="secondary" onClick={() => deleteImage(image.id)}>
        Delete
      </Button>
    </CardActions>
  </Card>);

  const renderUploadMessage = () => (fileList === null || fileList.length === 0)
    ? <Typography>No file chosen</Typography>
    : <Typography variant="overline" className={classes.fileLabel}>{fileList[0].name}</Typography>;

  const isUploadDisabled = (fileList === null || fileList.length === 0);

  const renderUploadInput = () => <>
    <Grid container>
      <Button
        variant="contained"
        component="label"
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
          </span>
        }
      />
    </Snackbar>);

  return (<Grid container>
    {
      imagesRequestState.loading
        ? <CircularProgress />
        : imagesRequestState.error
          ? renderGetError()
          : <>
            {imagesRequestState.value.map(renderImage)}
            {renderUploadInput()}
            {
              [
                uploadImageState,
                deleteImageState,
                changeImageOrderState,
              ].map(state => state.error ? renderErrorMessage(state.error.message) : null)
            }
          </>
    }
  </Grid>);
};

export default MainGallery;
