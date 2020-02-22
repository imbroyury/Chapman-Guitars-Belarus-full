import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@material-ui/core';

const DisplayProperty = (props) => {
  const { item, property } = props;
  return <Typography>
    {`${property.label}: ${item[property.name]}`}
  </Typography>;
};

DisplayProperty.propTypes = {
  item: PropTypes.object,
  property: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default DisplayProperty;
