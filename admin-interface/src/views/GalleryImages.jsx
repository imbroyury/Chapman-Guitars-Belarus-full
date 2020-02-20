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

const GalleryImages = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  const [shouldRefetch, setShouldRefetch] = useState(false);
  const scheduleRefetch = () => setShouldRefetch(true);
  // cache fetched images for smooth re-render
  const [images, setImages] = useState([]);

  const resetAfterFetch = () => {
    setShouldRefetch(false);
  };

  const imagesRequestState = useAsync(async () => {
    const { data: images } = await axios.get('/gallery-images');
    resetAfterFetch();
    setImages(images);
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
    deleteImageState,
    changeImageOrderState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

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

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    action={
      <Button onClick={reloadHandler} size="small" className={classes.reloadButton}>Reload</Button>
    }
  />);

  return (<Grid container>
    {images.map(renderImage)}
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(error => renderErrorMessage(error.message))}
  </Grid>);
};

export default Remount(GalleryImages);
