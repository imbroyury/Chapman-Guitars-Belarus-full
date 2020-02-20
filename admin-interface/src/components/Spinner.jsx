import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  CircularProgress,
} from '@material-ui/core';

const Spinner = (props) => <Dialog open={props.open}>
  <DialogContent><CircularProgress /></DialogContent>
</Dialog>;

Spinner.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default Spinner;