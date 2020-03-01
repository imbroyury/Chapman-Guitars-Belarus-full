import { GuitarSeries, MainGalleryImage, Guitar, GuitarColor, Image, Artist, User, PageMetadata } from './Models.js';
import * as UserService from '../UserService';

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
  // mlv
  [
    '4258ff30-5ae9-11ea-88fe-ad59fa5e167b.png',
    '425b2210-5ae9-11ea-88fe-ad59fa5e167b.png',
    '425c3380-5ae9-11ea-88fe-ad59fa5e167b.png'
  ]
];

const galleryImgs = [
  '5d3d83f0-45d3-11ea-9f37-75cdc8dd7f78.jpeg',
  '615248e0-45d3-11ea-9f37-75cdc8dd7f78.jpeg',
  'dc002870-4f4f-11ea-989a-bb3e4aa67001.jpeg',
];

const artistImgs = [
  '26f13240-4521-11ea-ab06-ad38a67e52fc.jpeg',
  '8a14a38d-f830-4bfa-a21d-bd9a91bbd37f.jpeg',
  'a665d8f9-d52d-43e5-9c57-0d49b742333f.jpeg',
  'b2df4139-9913-415e-819e-8e174c13c343.jpeg',
  '24490ec0-5af0-11ea-8eca-cf89d66ca9f2.jpeg'
];

export default async () => {
  const series = await GuitarSeries.bulkCreate([{
    name: 'Standard', uri: 'st', order: 1
  }, {
    name: 'Pro', uri: 'pro', order: 2,
  }]);

  const guitars = await Guitar.bulkCreate([{
    name: 'ML1 Modern',
    uri: 'ml1-m',
    seriesId: series[0].get('id'),
    order: 1,
    tuners: 'Закрытые Chapman Classic (18:1)',
    neck: 'Клён с матовым финишем',
    fretboard: 'Макассарский эбен',
    frets: '24 джамбо лада (никель)',
    scaleLength: 648,
    body: 'Махогани',
    neckPickup: 'Chapman Sonorous Zerø Humbucker',
    bridgePickup: 'Chapman Sonorous Zerø Humbucker',
    bridge: 'Хардтейл (струны сквозь корпус)',
    weight: 3500,
    metaKeywords: 'гитара, клён, эбен, махогани',
    metaDescription: 'Гитара из махогани с хардтейлом'
  }, {
    name: 'ML2 Modern',
    uri: 'ml2-m',
    seriesId: series[0].get('id'),
    order: 2,
    tuners: 'Закрытые Chapman Classic (18:1)',
    neck: 'Клён с матовым финишем',
    fretboard: 'Макассарский эбен',
    frets: '24 джамбо лада (никель)',
    scaleLength: 635,
    body: 'Махогани',
    neckPickup: 'Chapman Stentorian Zerø Humbucker',
    bridgePickup: 'Chapman Stentorian Zerø Humbucker',
    bridge: 'Tune-o-matic со стоп-баром',
    weight: 3500,
    metaKeywords: 'гитара, клён, эбен, махогани',
    metaDescription: 'Гитара из махогани с тюн-о-матиком'
  }, {
    name: 'MLV Modern',
    uri: 'mlv-m',
    seriesId: series[1].get('id'),
    order: 1,
    tuners: 'Локовые Hipshot (18:1)',
    neck: 'Махогани с матовым финишем',
    fretboard: 'Индийский эбен',
    frets: '224 джамбо лада (нержавеющая сталь)',
    scaleLength: 648,
    body: 'Махогани',
    neckPickup: 'Chapman Stentorian Humbucke',
    bridgePickup: 'Chapman Stentorian Humbucke',
    bridge: 'Тремоло Floyd Rose',
    weight: 3750,
    metaKeywords: 'гитара, клён, эбен, махогани, флойд',
    metaDescription: 'Гитара из махогани с флойдом'
  }]);

  const images = await Promise.all(
    [...imgs, galleryImgs, artistImgs].map(imgSet => Image.bulkCreate(imgSet.map(name => ({ name }))))
  );

  await GuitarColor.bulkCreate([{
    name: 'Midnight Sky',
    order: 10,
    guitarId: guitars[0].get('id'),
    tabImageId: images[0][0].get('id'),
    dotImageId: images[0][1].get('id'),
    guitarImageId: images[0][2].get('id'),
  },
  {
    name: 'Lunar',
    order: 1,
    guitarId: guitars[0].get('id'),
    tabImageId: images[1][0].get('id'),
    dotImageId: images[1][1].get('id'),
    guitarImageId: images[1][2].get('id'),
  },
  {
    name: 'White Dove',
    order: 0,
    guitarId: guitars[1].get('id'),
    tabImageId: images[2][0].get('id'),
    dotImageId: images[2][1].get('id'),
    guitarImageId: images[2][2].get('id'),
  },
  {
    name: 'Iris',
    order: 0,
    guitarId: guitars[2].get('id'),
    tabImageId: images[3][0].get('id'),
    dotImageId: images[3][1].get('id'),
    guitarImageId: images[3][2].get('id'),
  },
  ]);

  await MainGalleryImage.bulkCreate(
    images[4].map((galleryImage, i) => ({ order: i, imageId: galleryImage.id }))
  );

  await Artist.bulkCreate([
    {
      name: 'Rob Chapman',
      order: 1,
      uri: 'rob-chapman',
      description: 'Роб - гитарист из Брайтона, Великобритания. Основатель Chapman Guitars, фронтмен группы Dorje, обозреватель для магазина Andertons Music.',
      photoId: images[5][0].id,
      metaKeywords: 'гитарист, великборитани',
      metaDescription: 'Гитарист из великобритании'
    }, {
      name: 'Rabea Massaad',
      order: 2,
      uri: 'rabea-massaad',
      description: 'Рабеа - гитарист групп Dorje (#1 в рок чарте Великобритании в 2015 году) и Toska (#1 в мировом чартеBandcamp). Занимался музыкой с детских лет - в 8 лет он сел за барабанную установку, а в 15 взялся за гитару.Участвовал в разработке многих гитар Chapman.',
      photoId: images[5][1].id,
      metaKeywords: 'гитарист, великборитани',
      metaDescription: 'Гитарист из великобритании',
    }, {
      name: 'Rob Scallon',
      order: 3,
      uri: 'rob-scallon',
      description: 'Роб - талантливый музыкант-мультиинструменталист. Его видео и каверы на популярные песни на необычных инструментах (например Slipknot - Psychosocial на банжо) завоевали уже более 1 миллиона человек. Любимым инструментом Роба все же остается его 8-струнная гитара Chapman.',
      photoId: images[5][2].id,
      metaKeywords: 'гитарист, youtube',
      metaDescription: 'Гитарист youtube-р',
    }, {
      name: 'Leo Moracchioli',
      order: 3,
      uri: 'leo-moracchioli',
      description: 'Лео - норвежский музыкант, основатель Frog Leap Studios. Записывает музыку, продюсирует группы, выступает вживую. Запустил канал на YouTube с кавера на песню Lady Gaga - Poker Face, набравшего почти 9 миллиона просмотров, после чего активно развивается на данной платформе.',
      photoId: images[5][3].id,
      metaKeywords: 'гитарист, норвегия, youtube',
      metaDescription: 'Гитарист-норвежец youtube-р'
    }, {
      name: 'Felix Hagan',
      order: 3,
      uri: 'felix-hagan',
      description: 'Феликс - основатель группы из 7 участников Felix Hagan & The Family. Ребята экспериментируют в жанрах new-glam, high camp pop, панк, классический рок.',
      photoId: images[5][4].id,
      metaKeywords: 'гитарист, группа, эксперименты',
      metaDescription: 'Гитарист в группе'
    },
  ]);

  await PageMetadata.bulkCreate([{
    uri: '/',
    isBasePage: false,
    title: 'Гитары Chapman Беларусь',
    metaKeywords: 'Chapman, гитары, беларусь',
    metaDescription: 'Гитары Chapman в Беларуси',
    priority: 0.9,
    changefreq: 'monthly',
  }, {
    uri: '/guitars',
    isBasePage: false,
    title: 'Гитары Chapman - Галерея гитар',
    metaKeywords: 'гитары, галерея, выбор',
    metaDescription: 'Гитары Chapman в Беларуси - галерея гитар',
    priority: 0.9,
    changefreq: 'monthly',
  }, {
    uri: '/artists',
    isBasePage: false,
    title: 'Гитары Chapman - Артисты бренда',
    metaKeywords: 'гитары, Chapman, артисты',
    metaDescription: 'Гитары Chapman в Беларуси - артисты бренда',
    priority: 0.9,
    changefreq: 'monthly',
  }, {
    uri: '/purchase',
    isBasePage: false,
    title: 'Гитары Chapman - Как купить',
    metaKeywords: 'гитары, покупка',
    metaDescription: 'Гитары Chapman в Беларуси - как купить',
    priority: 0.9,
    changefreq: 'monthly',
  }, {
    uri: '/contact',
    isBasePage: false,
    title: 'Гитары Chapman - Как связаться',
    metaKeywords: 'гитары, связь',
    metaDescription: 'Гитары Chapman в Беларуси - как связаться',
    priority: 0.9,
    changefreq: 'monthly',
  }, {
    uri: '/search',
    isBasePage: false,
    title: 'Гитары Chapman - Поиск',
    metaKeywords: 'поиск',
    metaDescription: 'Гитары Chapman в Беларуси - поиск по сайте',
    priority: 0.9,
    changefreq: 'monthly',
  }, {
    uri: '/guitar',
    isBasePage: true,
    title: 'Гитары Chapman - Гитары -',
    metaKeywords: 'гитары, Champan',
    metaDescription: 'Гитары Chapman в Беларуси',
    priority: 0.9,
    changefreq: 'monthly',
  }, {
    uri: '/artist',
    isBasePage: true,
    title: 'Гитары Chapman - Артисты -',
    metaKeywords: 'артист, бренд, гитары',
    metaDescription: 'Гитары Chapman в Беларуси - артист бренда',
    priority: 0.9,
    changefreq: 'monthly',
  }]);

  await UserService.createUser('admin', 'admin11');
};