import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  descriptonHTML: {
    fontFamily: theme.typography.fontFamily
  }
}));

const DisplayProperty = (props) => {
  const { item, property } = props;
  const classes = useStyles();

  const renderHTMLProperty = () => <>
    <Typography>{property.label}</Typography>
    <div
      dangerouslySetInnerHTML={{ __html: item[property.name]}}
      className={classes.descriptonHTML} />
  </>;

  const renderProperty = () => <Typography>
    {`${property.label}: ${item[property.name]}`}
  </Typography>;

  if (property.type === 'html') return renderHTMLProperty();
  return renderProperty();
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
