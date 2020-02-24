import GalleryImages from './views/GalleryImages/GalleryImages';
import AddGalleryImage from './views/GalleryImages/AddGalleryImage';
import Artists from './views/Artists/Artists';
import AddArtist from './views/Artists/AddArtist';
import Login from './views/Login/Login';
import GuitarSeries from './views/GuitarSeries/GuitarSeries';
import AddGuitarSeries from './views/GuitarSeries/AddGuitarSeries';
import Guitars from './views/Guitars/Guitars';
import AddGuitar from './views/Guitars/AddGuitar';
import AddGuitarColor from './views/GuitarColor/AddGuitarColor';
import Route404 from './views/404/Route404';

export const routes = {
  preAuth: [
    [{
      View: Login,
      path: '/login',
      linkLabel: 'Log in',
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
    },
    {
      View: AddGuitar,
      path: '/add-guitar',
      linkLabel: 'Add Guitar'
    }],
    [{
      View: AddGuitarColor,
      path: '/add-guitar-color/:guitarId',
    }],
    // last
    [{
      View: Route404,
      path: '*'
    }]
  ],
};
