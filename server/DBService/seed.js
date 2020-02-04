import { GuitarSeries, MainGalleryImage, Guitar, GuitarColor, Image } from './Models.js';

const imgs = [
  // ml-1 Midnight Sky
  [
    '26f13240-4521-11ea-ab06-ad38a67e52fc.png',
    '2bc3a1e0-4521-11ea-ab06-ad38a67e52fc.png',
    '319f1d10-4521-11ea-ab06-ad38a67e52fc.png',
  ],
  // ml-1 Lunar
  [
    '83ca6a20-4537-11ea-8153-a53ebdbd6a0f.png',
    '87f85c60-4537-11ea-8153-a53ebdbd6a0f.png',
    '8ca62d00-4537-11ea-8153-a53ebdbd6a0f.png',
  ],
  // ml-2 White Dove
  [
    '7c100ae0-4539-11ea-b407-0b22c6d90d7f.png',
    '7febe580-4539-11ea-b407-0b22c6d90d7f.png',
    '836b9660-4539-11ea-b407-0b22c6d90d7f.png',
  ],
];

const galleryImgs = [
  '5d3d83f0-45d3-11ea-9f37-75cdc8dd7f78.jpeg',
  '615248e0-45d3-11ea-9f37-75cdc8dd7f78.jpeg',
];

export default async () => {
  const series = await GuitarSeries.create({ name: 'Standard', uri: 'st' });

  const guitars = await Guitar.bulkCreate([{
    name: 'ML1 Modern',
    uri: 'ml1-m',
    seriesId: series.get('id'),
  }, {
    name: 'ML2 Modern',
    uri: 'ml2-m',
    seriesId: series.get('id'),
  }]);

  const images = await Promise.all(
    [...imgs, galleryImgs].map(imgSet => Image.bulkCreate(imgSet.map(name => ({ name }))))
  );

  await GuitarColor.bulkCreate([{
    name: 'Midnight Sky',
    guitarId: guitars[0].get('id'),
    tabImageId: images[0][0].get('id'),
    dotImageId: images[0][1].get('id'),
    guitarImageId: images[0][2].get('id'),
  },
  {
    name: 'Lunar',
    guitarId: guitars[0].get('id'),
    tabImageId: images[1][0].get('id'),
    dotImageId: images[1][1].get('id'),
    guitarImageId: images[1][2].get('id'),
  },
  {
    name: 'White Dove',
    guitarId: guitars[1].get('id'),
    tabImageId: images[2][0].get('id'),
    dotImageId: images[2][1].get('id'),
    guitarImageId: images[2][2].get('id'),
  },
  ]);

  await MainGalleryImage.bulkCreate(
    images[3].map((galleryImage, i) => ({ order: i, imageId: galleryImage.id }))
  );
};