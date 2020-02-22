import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
} from '@material-ui/core';

const EditProperty = (props) => {
  const { item, property, onChange, inputClassName } = props;
  return <Grid container>
    <TextField
      label={property.label}
      name={property.name}
      value={item[property.name]}
      type={property.type}
      onChange={onChange}
      className={inputClassName}
    />
  </Grid>;
};

EditProperty.propTypes = {
  item: PropTypes.object,
  property: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
  onChange: PropTypes.func,
  inputClassName: PropTypes.string,
};

export default EditProperty;
