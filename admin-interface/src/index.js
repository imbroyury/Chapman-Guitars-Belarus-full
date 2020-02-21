import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GalleryImages from './views/GalleryImages';
import AddGalleryImage from './views/AddGalleryImage';
import Artists from './views/Artists';
import AddArtist from './views/AddArtist';
import Login from './views/Login';
import Register from './views/Register';
import GuitarSeries from './views/GuitarSeries';
import AddGuitarSeries from './views/AddGuitarSeries';
import Guitars from './views/Guitars';
import AddGuitarColor from './views/AddGuitarColor';
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

const routes = {
  preAuth: [
    [{
      View: Login,
      path: '/login',
      linkLabel: 'Log in',
    }],
    [{
      View: Register,
      path: '/register',
      linkLabel: 'Register',
    }],
  ],
  auth: [
    [{
      View: GalleryImages,
      path: '/gallery-images',
      linkLabel: 'Gallery Images',
    },
    {
      View: AddGalleryImage,
      path: '/add-gallery-image',
      linkLabel: 'Add Gallery Image',
    }],
    [{
      View: Artists,
      path: '/artists',
      linkLabel: 'Artists',
    },
    {
      View: AddArtist,
      path: '/add-artist',
      linkLabel: 'Add artist',
    }],
    [{
      View: GuitarSeries,
      path: '/guitar-series',
      linkLabel: 'Guitar Series'
    },
    {
      View: AddGuitarSeries,
      path: '/add-guitar-series',
      linkLabel: 'Add Guitar Series'
    }],
    [{
      View: Guitars,
      path: '/guitars',
      linkLabel: 'Guitars'
    }],
    [{
      View: AddGuitarColor,
      path: '/add-guitar-color/:guitarId',
    }]
  ],
};

// const PAGE_TITLE = 'FileStorage';

const Root = () => {
  const classes = useStyles();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const loginUser = () => setIsUserLoggedIn(true);

  // useEffect(() => {
  //   if (isUserLoggedIn) {
  //     document.title = PAGE_TITLE + ' - ' + AuthService.getAuthData().login;
  //   } else {
  //     document.title = PAGE_TITLE;
  //   }
  // }, [isUserLoggedIn])

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

  const renderRoute = route => (
    <Route path={route.path} key={route.path}>
      <route.View isUserLoggedIn={isUserLoggedIn} loginUser={loginUser} />
    </Route>
  );

  return (<Router>
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{paper: classes.drawerPaper}}
    >
      <List>
        {(isUserLoggedIn ? routes.auth : routes.preAuth).map(renderLinkToRouteList)}
      </List>
    </Drawer>
    <main className={classes.view}>
      <Switch>
        {[...routes.auth, ...routes.preAuth].flat().map(renderRoute)}
        <Route path="*">
          404
        </Route>
      </Switch>
    </main>
  </Router>);
};

ReactDOM.render(<Root />, document.getElementById('root'));
