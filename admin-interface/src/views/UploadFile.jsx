import axios from 'axios';
import uuid from 'uuid/v1';
import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Paper,
  Chip,
  Button,
  LinearProgress,
  Grid,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import headers from '../shared/headers';
import { requestStatuses } from '../uploadStatuses';
import { Redirect } from 'react-router-dom';
import AuthService from '../AuthService';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '2rem',
  },
  uploadInput: {
    display: 'none'
  },
  fileLabel: {
    maxWidth: '25rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  snackbarMessage: {
    display: 'flex',
    alignItems: 'center',
  },
  snackbarIcon: {
    fontSize: 20,
    marginRight: '0.5rem',
  },
  snackbarSuccess: {
    backgroundColor: green[600],
  },
  snackbarError: {
    backgroundColor: theme.palette.error.dark,
  }
}));

const UploadFile = (props) => {
  const classes = useStyles();
  // upload state for useEffect
  const [shouldInitUpload, setShouldInitUpload] = useState(false);
  const [uploadState, setUploadState] = useState(requestStatuses.uninitialized);
  const [uploadId, setUploadId] = useState(null);
  // from inputs
  const [fileList, setFileList] = useState(null);
  const [comment, setComment] = useState('');

  const initializeUpload = () => {
    setShouldInitUpload(true);
    setUploadId(uuid());
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleChangeFileList = (e) => setFileList(e.target.files);

  useEffect(() => {
    if (shouldInitUpload) {
      setUploadState(requestStatuses.running);

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      const formData = new FormData();
      formData.append('file', fileList[0]);
      formData.append('comment', comment);

      const uploadFile = async () => {
        try {
          await axios.post(
            '/upload-file',
            formData,
            {
              params: { uploadId },
              headers: { [headers.userToken]: AuthService.getAuthData().token },
              cancelToken: source.token
            },
          );
          setUploadState(requestStatuses.done);
        } catch(e) {
          if (axios.isCancel(e)) return;
          setUploadState(requestStatuses.error);
        }
      };

      uploadFile();

      return source.cancel;
    }
  }, [shouldInitUpload, uploadId, comment, fileList]);

  const renderUploadMessage = () => (fileList === null || fileList.length === 0)
    ? <Typography>No file chosen</Typography>
    : <Typography variant="overline" className={classes.fileLabel}>{fileList[0].name}</Typography>;

  const getIsInputDisabled = () => uploadState !== requestStatuses.uninitialized;

  const getIsSubmiDisabled = () =>
    fileList === null ||
    fileList.length === 0 ||
    uploadState !== requestStatuses.uninitialized;

  const renderSuccessMessage = () =>
    (<Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open
    >
      <SnackbarContent
        className={classes.snackbarSuccess}
        message={
          <span className={classes.snackbarMessage}>
            <CheckCircleIcon className={classes.snackbarIcon}/>
            Done! See your upload in 'All files'
          </span>
        }
      />
    </Snackbar>);

  const renderErrorMessage = () =>
    (<Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open
    >
      <SnackbarContent
        className={classes.snackbarError}
        message={
          <span className={classes.snackbarMessage}>
            <ErrorIcon className={classes.snackbarIcon}/>
            Sorry, something went wrong. Please try again later
          </span>
        }
      />
    </Snackbar>);

  return (<Grid container>
    <Paper className={classes.paper}>
      <Typography variant="h5" gutterBottom>Upload a new file</Typography>
      <Grid container>
        <Button
          variant="contained"
          component="label"
          disabled={getIsInputDisabled()}
        >
          Choose File
          <input
            type="file"
            className={classes.uploadInput}
            onChange={handleChangeFileList}
          />
        </Button>
        {renderUploadMessage()}
      </Grid>
      <Grid container>
        <TextField
          label="Comment"
          multiline
          rowsMax="4"
          value={comment}
          onChange={handleCommentChange}
          variant="filled"
          disabled={getIsInputDisabled()}
        />
      </Grid>
      <Grid container>
        <Button
          variant="contained"
          onClick={initializeUpload}
          color="primary"
          disabled={getIsSubmiDisabled()}
        >
          Upload
        </Button>
      </Grid>
      {uploadState === requestStatuses.done && renderSuccessMessage()}
      {uploadState === requestStatuses.error && renderErrorMessage()}
      {!props.isUserLoggedIn && <Redirect to='/login' />}
    </Paper>
  </Grid>);
};

export default UploadFile;
