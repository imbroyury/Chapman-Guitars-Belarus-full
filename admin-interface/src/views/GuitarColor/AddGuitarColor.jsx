import React, { useState } from 'react';
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
import { Remount } from '../../HOC/Remount';
import { Redirect, useParams } from 'react-router-dom';
import { ErrorSnackbar, Spinner, FileInput } from '../../components/index.js';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const images = [
  {
    label: 'tab',
    name: 'tabImage',
  },
  {
    label: 'dot',
    name: 'dotImage',
  },
  {
    label: 'guitar',
    name: 'guitarImage',
  }
];

const AddGuitarColor = () => {
  const { guitarId } = useParams();

  const classes = useStyles();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [imageFileLists, setImageFileLists] = useState(
    images.map(image => ({ name: image.name, fileList: null }))
  );

  const [guitarColor, setGuitarColor] = useState({
    order: 0,
    name: '',
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setGuitarColor({
      ...guitarColor,
      [name]: value,
    });
  };

  const handleChangeImageFileList = (name) => (e) => {
    const arrayId = imageFileLists.findIndex(ifl => ifl.name === name);
    const item = imageFileLists[arrayId];
    const itemStateModel = {
      name: item.name,
      fileList: e.target.files,
    };
    const newFileList = [
      ...imageFileLists.slice(0, arrayId),
      itemStateModel,
      ...imageFileLists.slice(arrayId + 1)
    ];
    setImageFileLists(newFileList);
  };

  const [addColorState, addColor] = useAsyncFn(async () => {
    const formData = new FormData();
    images.forEach(image => formData.append(
      image.name,
      imageFileLists.find(ifl => ifl.name === image.name).fileList[0]
    ));
    formData.append('order', guitarColor.order);
    formData.append('name', guitarColor.name);
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

  const isUploadDisabled = imageFileLists
    .some(ifl => ifl.fileList === null || ifl.fileList === 0) || isInteractionDisabled;

  const renderUploadImageInputs = () =>
    images.map(image => <FileInput
      key={image.label}
      label={`Select ${image.label} image to upload`}
      onChange={handleChangeImageFileList(image.name)}
      disabled={isInteractionDisabled}
      fileList={imageFileLists.find(ifl => ifl.name === image.name).fileList}
    />);

  const renderAddImageForm = () => <Card className={classes.card}>
    <CardContent>
      {renderUploadImageInputs()}
      <Grid container><TextField label='Order' name="order" type="number" value={guitarColor.order} onChange={handleChangeInput} /></Grid>
      <Grid container><TextField label='Name' name="name" type="string" value={guitarColor.name} onChange={handleChangeInput} /></Grid>
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

  const renderErrorMessage = (errorMessage) => (<ErrorSnackbar
    open
    errorMessage={errorMessage}
    key={errorMessage}
    actionLabel='Retry'
    actionHandler={addColor}
  />);

  return (<Grid container>
    {renderAddImageForm()}
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(error => renderErrorMessage(error.message))}
    {shouldRedirect && <Redirect to="/guitars" />}
  </Grid>);
};

export default Remount(AddGuitarColor);
