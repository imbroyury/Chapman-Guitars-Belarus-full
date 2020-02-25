import sequelize from './sequelize.js';
import { GuitarSeries, Guitar, GuitarColor, Image, MainGalleryImage, Artist, User, Session } from './Models.js';
import seed from './seed.js';

export const init = async () => {
  try {
    console.log('Connection has been established successfully.');

    await sequelize.authenticate();

    await sequelize.sync();

    console.log('Models x Tables sync complete');
    await User.hasMany(Session, { foreignKey: 'userId' });
    await Session.belongsTo(User, { foreignKey: 'userId' });

    await GuitarSeries.hasMany(Guitar, { foreignKey: 'seriesId' });
    await Guitar.belongsTo(GuitarSeries, { foreignKey: 'seriesId' });

    await Guitar.hasMany(GuitarColor, { foreignKey: 'guitarId' });
    await GuitarColor.belongsTo(Guitar, { foreignKey: 'guitarId' });

    await GuitarColor.belongsTo(Image, { foreignKey: 'guitarImageId', as: 'guitarImage' });
    await GuitarColor.belongsTo(Image, { foreignKey: 'tabImageId', as: 'tabImage' });
    await GuitarColor.belongsTo(Image, { foreignKey: 'dotImageId', as: 'dotImage' });
    await Image.hasOne(GuitarColor, { foreignKey: 'guitarImageId', as: 'guitarImage' });
    await Image.hasOne(GuitarColor, { foreignKey: 'tabImageId', as: 'tabImage' });
    await Image.hasOne(GuitarColor, { foreignKey: 'dotImageId', as: 'dotImage' });

    await Image.hasOne(MainGalleryImage, { foreignKey: 'imageId' });
    await MainGalleryImage.belongsTo(Image, { foreignKey: 'imageId' });

    await Image.hasOne(Artist, { foreignKey: 'photoId', as: 'photo' });
    await Artist.belongsTo(Image, { foreignKey: 'photoId', as: 'photo' });

    console.log('Relationships established');

    try {
      // await sequelize.drop();
      // await sequelize.sync();
      // await seed();
    } catch (e) {
      console.error(e);
      console.log('*** Seeding failed because reasons ***');
    }

  } catch(e) {
    console.error('Unable to connect to the database:', e);
  }
};

export const putUser = async (login, password) => {
  const user = await User.create({ login, password });
  return user;
};

export const getUserByLoginAndPassword = async (login, password) => {
  const user = await User.findOne({ where: { login, password } });
  return user;
};

export const putSession = async (userId, token) => {
  const session = await Session.create({ userId, token });
  return session;
};

export const getSessionByToken = async (token) => {
  const session = await Session.findOne({ where: { token } });
  return session;
};

export const touchSession = async (token) => {
  const session = await getSessionByToken(token);
  session.changed('updatedAt', true);
  await session.save();
};

export const deleteSession = async (login, token) => {
  await Session.destroy({ where: { login, token } });
};

export const saveImageMetaData = async (name) => {
  const image = await Image.create({ name });
  return image;
};

export const getAllGuitars = async () => {
  const guitars = await Guitar.findAll({ include: { all: true, nested: true } });
  return guitars;
};

export const getAllGuitarsGroupedBySeries = async () => {
  const guitarSeries = await GuitarSeries.findAll({
    include: { all: true, nested: true },
    order: [['order', 'ASC'], [Guitar, 'order', 'ASC']]
  });
  return guitarSeries;
};

export const getGuitarByUri = async (uri) => {
  const guitar = await Guitar.findOne({
    where: { uri },
    include: { all: true, nested: true }
  });
  return guitar;
};

export const getAllGuitarUris = async () => {
  const guitars = await Guitar.findAll({
    attributes: ['uri']
  });
  const uris = guitars.map(guitar => guitar.uri);
  return uris;
};

export const getGuitar = async (id) => {
  const guitar = await Guitar.findOne({
    where: id,
  });
  return guitar;
};

export const putGuitar = async (
  name,
  uri,
  seriesId,
  order,
  tuners,
  neck,
  fretboard,
  frets,
  scaleLength,
  body,
  neckPickup,
  bridgePickup,
  bridge,
  weight,
) => {
  await Guitar.create({
    name,
    uri,
    seriesId,
    order,
    tuners,
    neck,
    fretboard,
    frets,
    scaleLength,
    body,
    neckPickup,
    bridgePickup,
    bridge,
    weight,
  });
};

export const deleteGuitar = async (id) => {
  await Guitar.destroy({
    where: {
      id,
    }
  });
};

export const editGuitar = async (
  id,
  name,
  uri,
  seriesId,
  order,
  tuners,
  neck,
  fretboard,
  frets,
  scaleLength,
  body,
  neckPickup,
  bridgePickup,
  bridge,
  weight,
) => {
  const guitar = await getGuitar(id);
  guitar.name = name,
  guitar.uri = uri,
  guitar.seriesId = seriesId,
  guitar.order = order,
  guitar.tuners = tuners,
  guitar.neck = neck,
  guitar.fretboard = fretboard,
  guitar.frets = frets,
  guitar.scaleLength = scaleLength,
  guitar.body = body,
  guitar.neckPickup = neckPickup,
  guitar.bridgePickup = bridgePickup,
  guitar.bridge = bridge,
  guitar.weight = weight,
  await guitar.save();
};

export const getMainGalleryImages = async () => {
  const images = await MainGalleryImage.findAll({
    include: [Image],
    order: [['order', 'ASC']],
  });
  return images;
};

export const getMainGalleryImage = async (galleryImageId) => {
  const image = await MainGalleryImage.findOne({
    where: {
      id: galleryImageId,
    },
    include: [Image],
  });
  return image;
};

export const putMainGalleryImage = async (imageId, order) => {
  await MainGalleryImage.create({
    imageId: imageId,
    order
  });
};

export const deleteMainGalleryImage = async (galleryImageId) => {
  await MainGalleryImage.destroy({
    where: {
      id: galleryImageId,
    },
  });
};

export const deleteImage = async (id) => {
  await Image.destroy({
    where: {
      id,
    }
  });
};

export const editMainGalleryImage = async (galleryImageId, order) => {
  const galleryImage = await MainGalleryImage.findOne({ where: { id: galleryImageId }});
  galleryImage.order = order;
  await galleryImage.save();
};

export const getAllArtists = async () => {
  const artists = await Artist.findAll({
    include: [{ model: Image, as: 'photo' }],
    order: [['order', 'ASC']],
  });
  return artists;
};

export const getAllArtistUris = async () => {
  const artists = await Artist.findAll({
    attributes: ['uri']
  });
  const uris = artists.map(artist => artist.uri);
  return uris;
};

export const getArtist = async (id) => {
  const artist = await Artist.findOne({
    where: {
      id,
    },
    include: [{ model: Image, as: 'photo' }],
  });
  return artist;
};

export const getArtistByUri = async (uri) => {
  const artist = await Artist.findOne({
    where: { uri },
    include: [{ model: Image, as: 'photo' }],
  });
  return artist;
};

export const putArtist = async (order, name, uri, description, photoId) => {
  await Artist.create({
    order,
    name,
    uri,
    description,
    photoId,
  });
};

export const deleteArtist = async (id) => {
  await Artist.destroy({
    where: {
      id,
    }
  });
};

export const editArtist = async (id, order, name, uri, description) => {
  const artist = await getArtist(id);
  artist.order = order;
  artist.name = name;
  artist.uri = uri;
  artist.description = description;
  await artist.save();
};

export const getAllGuitarSeries = async () => {
  const guitarSeries = await GuitarSeries.findAll({
    include: [Guitar],
    order: [['order', 'ASC']],
  });
  return guitarSeries;
};

export const getGuitarSeries = async (id) => {
  const guitarSeries = await GuitarSeries.findOne({
    where: {
      id
    }
  });
  return guitarSeries;
};

export const putGuitarSeries = async (name, uri, order) => {
  await GuitarSeries.create({
    name,
    uri,
    order
  });
};

export const deleteGuitarSeries = async (id) => {
  await GuitarSeries.destroy({
    where: {
      id
    }
  });
};

export const editGuitarSeries = async (id, name, uri, order) => {
  const guitarSeries = await getGuitarSeries(id);
  guitarSeries.name = name;
  guitarSeries.uri = uri;
  guitarSeries.order = order;
  await guitarSeries.save();
};

export const putGuitarColor = async (guitarId, order, name, tabImageId, dotImageId, guitarImageId) => {
  await GuitarColor.create({
    guitarId,
    order,
    name,
    tabImageId,
    dotImageId,
    guitarImageId,
  });
};

export const getGuitarColor = async (id) => {
  const guitarColor = await GuitarColor.findOne({
    where: { id },
    include: [
      { model: Image, as: 'guitarImage' },
      { model: Image, as: 'tabImage' },
      { model: Image, as: 'dotImage' },
    ],
  });
  return guitarColor;
};

export const deleteGuitarColor = async (id) => {
  const guitarColor = await GuitarColor.destroy({
    where: { id },
  });
  return guitarColor;
};