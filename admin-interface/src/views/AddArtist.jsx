import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAsyncFn } from 'react-use';
import {
  Grid,
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
import { Spinner, ErrorSnackbar, FileInput } from '../components';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
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

  const renderUploadInput = () => <FileInput
    label="Select artist photo"
    onChange={handleChangeFileList}
    disabled={isInteractionDisabled}
    fileList={fileList}
  />;

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    actionLabel='Retry'
    actionHandler={addArtist}
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

AddArtist.propTypes = {
  remount: PropTypes.func,
};

export default AddArtist;
