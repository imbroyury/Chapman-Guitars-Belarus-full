import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from 'react-router-dom';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { routes } from './routes';
import { ProvideAuth, useAuth } from './services/useAuth';
import { Spinner, ErrorSnackbar } from './components';
// import AuthService from './AuthService';

const drawerWidth = '10rem';

const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  view: {
    marginLeft: drawerWidth,
  },
});

const PrivateRoute = ({ children, ...rest }) => { //eslint-disable-line
  const auth = useAuth();
  console.log('auth from PrivateRoute', auth);
  const renderProp = ({ location }) => auth.user.isAuthenticated //eslint-disable-line
    ? children
    : (<Redirect
      to={{
        pathname: '/login',
        state: { from: location }
      }}
    />);

  return (
    <Route
      {...rest}
      render={renderProp}
    />
  );
};

const Root = () => {
  const classes = useStyles();

  // Get auth state and re-render anytime it changes
  const auth = useAuth();
  useEffect(() => {
    auth.checkToken();
  }, []); // eslint-disable-line

  console.log('auth from Root', auth);

  const renderAuthError = (error) =>
    <ErrorSnackbar
      open
      errorMessage={error.response.data}
      key={error.response.data}
    />;

  const renderLinkToRoute = route => {
    const { linkLabel, path } = route;
    // don't render link if there is no link label
    return linkLabel
      ? (<ListItem button component={NavLink} to={path} key={path} activeClassName="Mui-selected">
        <ListItemText>{linkLabel}</ListItemText>
      </ListItem>)
      : null;
  };

  const renderLinkToRouteList = (linkList, index) =>
    <React.Fragment key={index}>
      {linkList.map(renderLinkToRoute)}
      <Divider />
    </React.Fragment>;

  const renderPreAuthRoute = route => (
    <Route path={route.path} key={route.path}>
      <route.View />
    </Route>
  );

  const renderRoute = route => (
    <PrivateRoute path={route.path} key={route.path}>
      <route.View />
    </PrivateRoute>
  );

  return (
    <>
      <Router>
        <Drawer
          variant="permanent"
          anchor="left"
          className={classes.drawer}
          classes={{paper: classes.drawerPaper}}
        >
          <List>
            {(auth.user.isAuthenticated ? routes.auth : routes.preAuth).map(renderLinkToRouteList)}
          </List>
        </Drawer>
        <main className={classes.view}>
          <Switch>
            {routes.preAuth.flat().map(renderPreAuthRoute)}
            {routes.auth.flat().map(renderRoute)}
            <Route path="*">
              404
            </Route>
          </Switch>
        </main>
      </Router>
      {<Spinner open={auth.authRequest.isRunning} />}
      {auth.authRequest.isError && renderAuthError(auth.authRequest.error)}
    </>);
};

ReactDOM.render(<ProvideAuth><Root /></ProvideAuth>, document.getElementById('root'));
