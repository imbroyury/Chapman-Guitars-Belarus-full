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
  const error = authRequest.error || 'Something went wrong';

  return <>
    {<Spinner
      open={isAuthRequestRunning} />}
    {<ErrorSnackbar
      open={hasAuthRequestErred}
      errorMessage={error}
    />}
  </>;
};

const withAuth = (View) => (props) => {
  useEffect(() => {
    AuthService.checkTokenRequest();
  }, []);
  return <View {...props} />;
};

const Views = () => {
  const classes = useStyles();

  const getRouteRenderer = isPrivate => route => {
    const RouteComponent = isPrivate ? PrivateRoute : Route;
    const { View, path, exact } = route;
    const AuthView = withAuth(View);

    return <RouteComponent path={path} key={path} exact={exact}>
      <AuthView />
    </RouteComponent>;
  };

  return <main className={classes.view}>
    <Switch>
      {routes.preAuth.flat().map(getRouteRenderer(false))}
      {routes.auth.flat().map(getRouteRenderer(true))}
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

const AppRouter = () => <Router>
  <NavDrawer />
  <Views />
</Router>;

const App = () => <>
  <AppRouter />
  <AuthProcess />
</>;

export default App;