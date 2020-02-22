import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';

const LabelledSelect = (props) => {
  const {
    options,
    value,
    label,
    name,
    onChange,
    className,
  } = props;

  const id = Math.random();
  const labelId = `select-${id}`;

  const renderOption = (option) =>
    <MenuItem
      value={option.id}
      key={option.id}
    >
      {option.name}
    </MenuItem>;

  return (<FormControl className={className}>
    <InputLabel id={labelId}>{label}</InputLabel>
    <Select
      name={name}
      value={value}
      onChange={onChange}
      labelId={labelId}
    >
      {options.map(renderOption)}
    </Select>
  </FormControl>);
};

LabelledSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, id: PropTypes.number })).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default LabelledSelect;
