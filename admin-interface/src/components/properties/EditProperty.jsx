import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditProperty = (props) => {
  const { item, property, onChange, inputClassName, disabled } = props;

  const handleWYSIWYGOnChange = (content) => onChange(property.name, content);
  const handleInputOnChange = (e) => onChange(property.name, e.target.value);
  const handleCheckboxOnChange = (e) => onChange(property.name, e.target.checked);

  const renderWYSIWYG = () => <ReactQuill
    value={item[property.name]}
    onChange={handleWYSIWYGOnChange}
    readOnly={disabled}
  />;

  const renderCheckbox = () => <FormControlLabel
    control={
      <Checkbox
        checked={item[property.name]}
        onChange={handleCheckboxOnChange}
        color="primary"
      />
    }
    label={property.label}
  />;

  const renderInput = () => <Grid container>
    <TextField
      label={property.label}
      value={item[property.name]}
      type={property.type}
      onChange={handleInputOnChange}
      disabled={disabled}
      className={inputClassName}
    />
  </Grid>;

  if (property.type === 'html') return renderWYSIWYG();
  if (property.type === 'boolean') return renderCheckbox();
  return renderInput();
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
