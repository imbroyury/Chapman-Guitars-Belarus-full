import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAsyncFn } from 'react-use';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Spinner, ErrorSnackbar, FileInput, EditProperty } from '../../components';
import { mainProperties, additionalProperties } from './properties';
import useItemFormState from '../../hooks/useItemFormState';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const AddArtist = () => {
  const classes = useStyles();

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [artist, handleChangeProperty, isArtistValid] = useItemFormState(mainProperties, additionalProperties);

  const [fileList, setFileList] = useState(null);
  const handleChangeFileList = (e) => setFileList(e.target.files);

  const handleChangeDescription = (content) => {
    // emulate event interface not to duplicate code in handleEditArtistInput
    const e = { target: { name: 'description', value: content } };
    handleChangeProperty(e);
  };

  const [addArtistState, addArtist] = useAsyncFn(async () => {
    const formData = new FormData();
    formData.append('photo', fileList[0]);
    [...mainProperties, ...additionalProperties]
      .map(prop => prop.name)
      .forEach(prop => formData.append(prop, artist[prop]));

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

  const isAddDisabled = (fileList === null || fileList.length === 0) ||
    isInteractionDisabled ||
    !isArtistValid;

  const renderUploadInput = () =>
    <FileInput
      label="Select artist photo"
      onChange={handleChangeFileList}
      disabled={isInteractionDisabled}
      fileList={fileList}
    />;

  const renderErrorMessage = (errorMessage) =>
    <ErrorSnackbar
      open
      errorMessage={errorMessage}
      key={errorMessage}
      actionLabel='Retry'
      actionHandler={addArtist}
    />;

  const renderPropertyEditMode = (property) =>
    <EditProperty
      key={property.name}
      item={artist}
      property={property}
      onChange={handleChangeProperty}
    />;

  const renderAddArtistForm = () => <Card className={classes.card}>
    <CardContent>
      {renderUploadInput()}
      {mainProperties.map(renderPropertyEditMode)}
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
