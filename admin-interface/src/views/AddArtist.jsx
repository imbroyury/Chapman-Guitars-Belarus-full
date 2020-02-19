import React, { useState } from 'react';
import axios from 'axios';
import { useAsyncFn } from 'react-use';
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
import { Redirect } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Spinner, ErrorSnackbar } from '../components';

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
  uploadInput: {
    display: 'none'
  },
  reloadButton: {
    color: 'white'
  }
});

const AddArtist = () => {
  const classes = useStyles();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [artist, setArtist] = useState({
    order: 0,
    name: '',
    description: '',
  });

  // input type='file'
  const [fileList, setFileList] = useState(null);
  const handleChangeFileList = (e) => setFileList(e.target.files);
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setArtist({
      ...artist,
      [name]: value,
    });
  };

  const handleChangeDescription = (content) => {
    // emulate event interface not to duplicate code in handleEditArtistInput
    const e = { target: { name: 'description', value: content } };
    handleChangeInput(e);
  };

  const [addArtistState, addArtist] = useAsyncFn(async () => {
    const formData = new FormData();
    formData.append('photo', fileList[0]);
    ['order', 'name', 'description'].forEach(prop => formData.append(prop, artist[prop]));
    const { data: uploadResult } = await axios.put(
      '/artist',
      formData,
    );
    setShouldRedirect(true);
    return uploadResult;
  }, [fileList, artist]);

  const requestStates = [
    addArtistState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const isInteractionDisabled = isSomeRequestInProgress;

  const isAddDisabled = (fileList === null || fileList.length === 0) || isInteractionDisabled || artist.name === '' || artist.description === '';

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
      Select artist photo
        <input
          type="file"
          className={classes.uploadInput}
          onChange={handleChangeFileList}
        />
      </Button>
      {renderUploadMessage()}
    </Grid>
  </>;

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    action={
      <Button onClick={addArtist} size="small" className={classes.reloadButton}>Retry</Button>
    }
  />);

  const renderAddArtistForm = () => <Card className={classes.card}>
    <CardContent>
      {renderUploadInput()}
      <Grid container><TextField label='Order' name="order" type="number" value={artist.order} onChange={handleChangeInput}/></Grid>
      <Grid container><TextField label='Name' name="name" value={artist.name} onChange={handleChangeInput}/></Grid>
      <ReactQuill
        value={artist.description}
        onChange={handleChangeDescription}
      />
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={addArtist}
        disabled={isAddDisabled}
      >
        Add
      </Button>
    </CardActions>
  </Card>;

  return (<Grid container>
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(error => renderErrorMessage(error.message))}
    {renderAddArtistForm()}
    {shouldRedirect && <Redirect to="/artists" />}
  </Grid>);
};

export default AddArtist;
