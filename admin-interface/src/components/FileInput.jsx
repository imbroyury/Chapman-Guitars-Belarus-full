
import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  uploadInput: {
    display: 'none'
  },
});

const FileInput = (props) => {
  const classes = useStyles();
  const { label, onChange, disabled, fileList } = props;

  const renderUploadMessage = () => (fileList === null || fileList.length === 0)
    ? <Typography>No file chosen</Typography>
    : <Typography variant="overline">{fileList[0].name}</Typography>;

  const renderButton = () => <Button
    variant="contained"
    component="label"
    disabled={disabled}
  >
    {label}
    <input
      type="file"
      className={classes.uploadInput}
      onChange={onChange}
    />
  </Button>;

  return <Grid container>
    {renderButton()}
    {renderUploadMessage()}
  </Grid>;
};

FileInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  fileList: PropTypes.shape({
    length: PropTypes.number,
    0: PropTypes.object,
  }),
};

export default FileInput;