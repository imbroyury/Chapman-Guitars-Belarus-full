import React from 'react';
import {
  Grid,
  Typography,
} from '@material-ui/core';
import { useUserSelector } from '../../store/useSelectors';

const Main = () => {
  const user = useUserSelector();
  return (<Grid container>
    <Typography>{`Hey there, ${user.login}! Proceed to any link in the drawer on your left`}</Typography>
  </Grid>);
};

export default Main;
