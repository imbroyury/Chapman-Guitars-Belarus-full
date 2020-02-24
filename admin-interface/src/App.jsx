import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import { Divider, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { routes } from './routes';
import { Spinner, ErrorSnackbar } from './components';
import * as AuthService from './services/AuthService';
import { requestStatuses } from './enums/requestStatuses';
import { useUserSelector, useAuthRequestSelector } from './store/useSelectors';

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

const PrivateRoute = ({ children, ...rest }) => { // eslint-disable-line react/prop-types
  const user = useUserSelector();

  const renderProp = ({ location }) => // eslint-disable-line react/prop-types
    user.isAuthenticated
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

const AuthProcess = () => {
  const authRequest = useAuthRequestSelector();
  const isAuthRequestRunning = authRequest.status === requestStatuses.running;
  const hasAuthRequestErred = authRequest.status === requestStatuses.error;

  const renderAuthError = (error) =>
    <ErrorSnackbar
      open
      errorMessage={error}
      key={error}
    />;

  return <>
    {<Spinner open={isAuthRequestRunning} />}
    {hasAuthRequestErred && renderAuthError(authRequest.error || 'Something went wrong')}
  </>;
};

const Views = () => {
  const classes = useStyles();

  const renderPublicRoute = route => (
    <Route path={route.path} key={route.path}>
      <route.View />
    </Route>
  );

  const renderPrivateRoute = route => (
    <PrivateRoute path={route.path} key={route.path}>
      <route.View />
    </PrivateRoute>
  );

  return <main className={classes.view}>
    <Switch>
      {routes.preAuth.flat().map(renderPublicRoute)}
      {routes.auth.flat().map(renderPrivateRoute)}
    </Switch>
  </main>;
};

const NavDrawer = () => {
  const classes = useStyles();

  const user = useUserSelector();

  const renderLinkToRoute = route => {
    const { linkLabel, path } = route;
    // don't render link if there is no link label
    if (!linkLabel) return null;

    return <ListItem
      button
      component={NavLink}
      to={path}
      key={path}
      activeClassName="Mui-selected"
    >
      <ListItemText>{linkLabel}</ListItemText>
    </ListItem>;
  };

  const renderLinkToRouteList = (linkList, index) =>
    <React.Fragment key={index}>
      {linkList.map(renderLinkToRoute)}
      <Divider />
    </React.Fragment>;

  return <Drawer
    variant="permanent"
    anchor="left"
    className={classes.drawer}
    classes={{ paper: classes.drawerPaper }}
  >
    <List>
      {(user.isAuthenticated ? routes.auth : routes.preAuth).map(renderLinkToRouteList)}
    </List>
  </Drawer>;
};

const AppRouter = () => {
  return <Router>
    <NavDrawer />
    <Views />
  </Router>;
};

const App = () => {
  // on the first app open check if user still has valid credentials
  useEffect(() => {
    AuthService.checkTokenRequest();
  }, []);

  return (<>
    <AppRouter />
    <AuthProcess />
  </>);
};

export default App;