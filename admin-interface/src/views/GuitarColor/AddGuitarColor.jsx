import React, { useState } from 'react';
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
import { Remount } from '../../HOC/Remount';
import { Redirect, useParams } from 'react-router-dom';
import { ErrorSnackbar, Spinner, FileInput, EditProperty } from '../../components/index.js';
import useItemFormState from '../../hooks/useItemFormState';
import useFileInputsState from '../../hooks/useFileInputsState';
import { mainProperties, fileProperties } from './properties';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const AddGuitarColor = () => {
  const { guitarId } = useParams();

  const classes = useStyles();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [imageFileLists, changeFileList] = useFileInputsState(fileProperties);
  const [guitarColor, handleChangeProperty, isGutarColorValid] = useItemFormState(mainProperties);

  const [addColorState, addColor] = useAsyncFn(async () => {
    const formData = new FormData();
    fileProperties.forEach(file => formData.append(
      file.name,
      imageFileLists.find(ifl => ifl.name === file.name).fileList[0]
    ));
    mainProperties
      .map(prop => prop.name)
      .forEach(prop => formData.append(prop, guitarColor[prop]));
    formData.append('guitarId', guitarId);
    const { data: uploadResult } = await axios.put(
      '/guitar-color',
      formData,
    );
    setShouldRedirect(true);
    return uploadResult;
  }, [imageFileLists, guitarColor]);


  const requestStates = [
    addColorState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const isUploadDisabled = imageFileLists.some(ifl => ifl.fileList === null || ifl.fileList === 0) ||
    isInteractionDisabled ||
    !isGutarColorValid;

  const renderUploadImageInputs = () =>
    fileProperties.map(file => <FileInput
      key={file.label}
      label={`Select ${file.label} image to upload`}
      onChange={changeFileList(file.name)}
      disabled={isInteractionDisabled}
      fileList={imageFileLists.find(ifl => ifl.name === file.name).fileList}
    />);

  const renderPropertyEditMode = (property) =>
    <EditProperty
      key={property.name}
      item={guitarColor}
      property={property}
      onChange={handleChangeProperty}
    />;

  const renderAddImageForm = () => <Card className={classes.card}>
    <CardContent>
      {renderUploadImageInputs()}
      {mainProperties.map(renderPropertyEditMode)}
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        onClick={addColor}
        color="primary"
        disabled={isUploadDisabled}
      >
        Add
      </Button>
    </CardActions>
  </Card>;

  const renderErrorMessage = (error) =>
    (<ErrorSnackbar
      open
      errorMessage={error.message}
      key={error.message}
      actionLabel='Retry'
      actionHandler={addColor}
    />);

  return (<Grid container>
    {renderAddImageForm()}
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(renderErrorMessage)}
    {shouldRedirect && <Redirect to="/guitars" />}
  </Grid>);
};

export default Remount(AddGuitarColor);
