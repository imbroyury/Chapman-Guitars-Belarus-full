-- MariaDB dump 10.17  Distrib 10.4.13-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: chapman
-- ------------------------------------------------------
-- Server version	10.4.13-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `artists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `uri` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `photoId` int(11) NOT NULL,
  `metaDescription` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `metaKeywords` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `uri` (`uri`),
  KEY `photoId` (`photoId`),
  CONSTRAINT `artists_ibfk_1` FOREIGN KEY (`photoId`) REFERENCES `images` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` VALUES (1,1,'Rob Chapman','rob-chapman','Роб - гитарист из Брайтона, Великобритания. Основатель Chapman Guitars, фронтмен группы Dorje, обозреватель для магазина Andertons Music.',16,'Гитарист из великобритании','гитарист, великборитани','2020-06-02 13:01:51','2020-06-02 13:01:51'),(2,2,'Rabea Massaad','rabea-massaad','Рабеа - гитарист групп Dorje (#1 в рок чарте Великобритании в 2015 году) и Toska (#1 в мировом чартеBandcamp). Занимался музыкой с детских лет - в 8 лет он сел за барабанную установку, а в 15 взялся за гитару.Участвовал в разработке многих гитар Chapman.',17,'Гитарист из великобритании','гитарист, великборитани','2020-06-02 13:01:51','2020-06-02 13:01:51'),(3,3,'Rob Scallon','rob-scallon','Роб - талантливый музыкант-мультиинструменталист. Его видео и каверы на популярные песни на необычных инструментах (например Slipknot - Psychosocial на банжо) завоевали уже более 1 миллиона человек. Любимым инструментом Роба все же остается его 8-струнная гитара Chapman.',18,'Гитарист youtube-р','гитарист, youtube','2020-06-02 13:01:51','2020-06-02 13:01:51'),(4,3,'Leo Moracchioli','leo-moracchioli','Лео - норвежский музыкант, основатель Frog Leap Studios. Записывает музыку, продюсирует группы, выступает вживую. Запустил канал на YouTube с кавера на песню Lady Gaga - Poker Face, набравшего почти 9 миллиона просмотров, после чего активно развивается на данной платформе.',19,'Гитарист-норвежец youtube-р','гитарист, норвегия, youtube','2020-06-02 13:01:51','2020-06-02 13:01:51'),(5,3,'Felix Hagan','felix-hagan','Феликс - основатель группы из 7 участников Felix Hagan & The Family. Ребята экспериментируют в жанрах new-glam, high camp pop, панк, классический рок.',20,'Гитарист в группе','гитарист, группа, эксперименты','2020-06-02 13:01:51','2020-06-02 13:01:51');
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guitarcolors`
--

DROP TABLE IF EXISTS `guitarcolors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guitarcolors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `guitarId` int(11) NOT NULL,
  `tabImageId` int(11) NOT NULL,
  `dotImageId` int(11) NOT NULL,
  `guitarImageId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `guitarId` (`guitarId`),
  KEY `tabImageId` (`tabImageId`),
  KEY `dotImageId` (`dotImageId`),
  KEY `guitarImageId` (`guitarImageId`),
  CONSTRAINT `guitarcolors_ibfk_1` FOREIGN KEY (`guitarId`) REFERENCES `guitars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guitarcolors_ibfk_2` FOREIGN KEY (`tabImageId`) REFERENCES `images` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `guitarcolors_ibfk_3` FOREIGN KEY (`dotImageId`) REFERENCES `images` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `guitarcolors_ibfk_4` FOREIGN KEY (`guitarImageId`) REFERENCES `images` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guitarcolors`
--

LOCK TABLES `guitarcolors` WRITE;
/*!40000 ALTER TABLE `guitarcolors` DISABLE KEYS */;
INSERT INTO `guitarcolors` VALUES (1,10,'Midnight Sky',1,1,2,3,'2020-06-02 13:01:51','2020-06-02 13:01:51'),(2,1,'Lunar',1,4,5,6,'2020-06-02 13:01:51','2020-06-02 13:01:51'),(3,0,'White Dove',2,7,8,9,'2020-06-02 13:01:51','2020-06-02 13:01:51'),(4,0,'Iris',3,10,11,12,'2020-06-02 13:01:51','2020-06-02 13:01:51');
/*!40000 ALTER TABLE `guitarcolors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guitars`
--

DROP TABLE IF EXISTS `guitars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guitars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `uri` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `seriesId` int(11) DEFAULT NULL,
  `tuners` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `neck` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fretboard` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `frets` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `scaleLength` int(11) NOT NULL,
  `body` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `neckPickup` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bridgePickup` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bridge` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `weight` int(11) NOT NULL,
  `metaDescription` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `metaKeywords` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `uri` (`uri`),
  KEY `seriesId` (`seriesId`),
  CONSTRAINT `guitars_ibfk_1` FOREIGN KEY (`seriesId`) REFERENCES `guitarseries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guitars`
--

LOCK TABLES `guitars` WRITE;
/*!40000 ALTER TABLE `guitars` DISABLE KEYS */;
INSERT INTO `guitars` VALUES (1,1,'ML1 Modern','ml1-m',1,'Закрытые Chapman Classic (18:1)','Клён с матовым финишем','Макассарский эбен','24 джамбо лада (никель)',648,'Махогани','Chapman Sonorous Zerø Humbucker','Chapman Sonorous Zerø Humbucker','Хардтейл (струны сквозь корпус)',3500,'Гитара из махогани с хардтейлом','гитара, клён, эбен, махогани','2020-06-02 13:01:51','2020-06-02 13:01:51'),(2,2,'ML2 Modern','ml2-m',1,'Закрытые Chapman Classic (18:1)','Клён с матовым финишем','Макассарский эбен','24 джамбо лада (никель)',635,'Махогани','Chapman Stentorian Zerø Humbucker','Chapman Stentorian Zerø Humbucker','Tune-o-matic со стоп-баром',3500,'Гитара из махогани с тюн-о-матиком','гитара, клён, эбен, махогани','2020-06-02 13:01:51','2020-06-02 13:01:51'),(3,1,'MLV Modern','mlv-m',2,'Локовые Hipshot (18:1)','Махогани с матовым финишем','Индийский эбен','224 джамбо лада (нержавеющая сталь)',648,'Махогани','Chapman Stentorian Humbucke','Chapman Stentorian Humbucke','Тремоло Floyd Rose',3750,'Гитара из махогани с флойдом','гитара, клён, эбен, махогани, флойд','2020-06-02 13:01:51','2020-06-02 13:01:51');
/*!40000 ALTER TABLE `guitars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guitarseries`
--

DROP TABLE IF EXISTS `guitarseries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guitarseries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `uri` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `uri` (`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guitarseries`
--

LOCK TABLES `guitarseries` WRITE;
/*!40000 ALTER TABLE `guitarseries` DISABLE KEYS */;
INSERT INTO `guitarseries` VALUES (1,1,'Standard','st','2020-06-02 13:01:51','2020-06-02 13:01:51'),(2,2,'Pro','pro','2020-06-02 13:01:51','2020-06-02 13:01:51');
/*!40000 ALTER TABLE `guitarseries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (20,'24490ec0-5af0-11ea-8eca-cf89d66ca9f2.jpeg'),(16,'26f13240-4521-11ea-ab06-ad38a67e52fc.jpeg'),(1,'26f13240-4521-11ea-ab06-ad38a67e52fc.png'),(2,'2bc3a1e0-4521-11ea-ab06-ad38a67e52fc.png'),(3,'319f1d10-4521-11ea-ab06-ad38a67e52fc.png'),(10,'4258ff30-5ae9-11ea-88fe-ad59fa5e167b.png'),(11,'425b2210-5ae9-11ea-88fe-ad59fa5e167b.png'),(12,'425c3380-5ae9-11ea-88fe-ad59fa5e167b.png'),(13,'5d3d83f0-45d3-11ea-9f37-75cdc8dd7f78.jpeg'),(14,'615248e0-45d3-11ea-9f37-75cdc8dd7f78.jpeg'),(7,'7c100ae0-4539-11ea-b407-0b22c6d90d7f.png'),(8,'7febe580-4539-11ea-b407-0b22c6d90d7f.png'),(9,'836b9660-4539-11ea-b407-0b22c6d90d7f.png'),(4,'83ca6a20-4537-11ea-8153-a53ebdbd6a0f.png'),(5,'87f85c60-4537-11ea-8153-a53ebdbd6a0f.png'),(17,'8a14a38d-f830-4bfa-a21d-bd9a91bbd37f.jpeg'),(6,'8ca62d00-4537-11ea-8153-a53ebdbd6a0f.png'),(18,'a665d8f9-d52d-43e5-9c57-0d49b742333f.jpeg'),(19,'b2df4139-9913-415e-819e-8e174c13c343.jpeg'),(15,'dc002870-4f4f-11ea-989a-bb3e4aa67001.jpeg');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maingalleryimages`
--

DROP TABLE IF EXISTS `maingalleryimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maingalleryimages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `imageId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `maingalleryimages_ibfk_1` FOREIGN KEY (`imageId`) REFERENCES `images` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maingalleryimages`
--

LOCK TABLES `maingalleryimages` WRITE;
/*!40000 ALTER TABLE `maingalleryimages` DISABLE KEYS */;
INSERT INTO `maingalleryimages` VALUES (1,0,13),(2,1,14),(3,2,15);
/*!40000 ALTER TABLE `maingalleryimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagemetadata`
--

DROP TABLE IF EXISTS `pagemetadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pagemetadata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uri` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `isBasePage` tinyint(1) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `metaDescription` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `metaKeywords` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `priority` float NOT NULL,
  `changefreq` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uri` (`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagemetadata`
--

LOCK TABLES `pagemetadata` WRITE;
/*!40000 ALTER TABLE `pagemetadata` DISABLE KEYS */;
INSERT INTO `pagemetadata` VALUES (1,'/',0,'Гитары Chapman Беларусь','Гитары Chapman в Беларуси','Chapman, гитары, беларусь',0.9,'monthly','2020-06-02 13:01:52','2020-06-02 13:01:52'),(2,'/guitars',0,'Гитары Chapman - Галерея гитар','Гитары Chapman в Беларуси - галерея гитар','гитары, галерея, выбор',0.9,'monthly','2020-06-02 13:01:52','2020-06-02 13:01:52'),(3,'/artists',0,'Гитары Chapman - Артисты бренда','Гитары Chapman в Беларуси - артисты бренда','гитары, Chapman, артисты',0.9,'monthly','2020-06-02 13:01:52','2020-06-02 13:01:52'),(4,'/purchase',0,'Гитары Chapman - Как купить','Гитары Chapman в Беларуси - как купить','гитары, покупка',0.9,'monthly','2020-06-02 13:01:52','2020-06-02 13:01:52'),(5,'/contact',0,'Гитары Chapman - Как связаться','Гитары Chapman в Беларуси - как связаться','гитары, связь',0.9,'monthly','2020-06-02 13:01:52','2020-06-02 13:01:52'),(6,'/search',0,'Гитары Chapman - Поиск','Гитары Chapman в Беларуси - поиск по сайте','поиск',0.9,'monthly','2020-06-02 13:01:52','2020-06-02 13:01:52'),(7,'/guitar',1,'Гитары Chapman - Гитары -','Гитары Chapman в Беларуси','гитары, Champan',0.9,'monthly','2020-06-02 13:01:52','2020-06-02 13:01:52'),(8,'/artist',1,'Гитары Chapman - Артисты -','Гитары Chapman в Беларуси - артист бренда','артист, бренд, гитары',0.9,'monthly','2020-06-02 13:01:52','2020-06-02 13:01:52');
/*!40000 ALTER TABLE `pagemetadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `searchablepages`
--

DROP TABLE IF EXISTS `searchablepages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `searchablepages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`),
  FULLTEXT KEY `content_fulltext_index` (`content`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `searchablepages`
--

LOCK TABLES `searchablepages` WRITE;
/*!40000 ALTER TABLE `searchablepages` DISABLE KEYS */;
INSERT INTO `searchablepages` VALUES (1,'/','Гитары Chapman в Беларуси','2020-06-02 13:01:53','2020-06-02 13:01:53'),(2,'/guitars','СЕРИЯ STANDARD ML1 Modern STANDARD ML2 Modern STANDARD СЕРИЯ PRO MLV Modern PRO','2020-06-02 13:01:53','2020-06-02 13:01:53'),(3,'/artists','Артисты бренда Champan Guitars Rob Chapman Rabea Massaad Rob Scallon Leo Moracchioli Felix Hagan','2020-06-02 13:01:53','2020-06-02 13:01:53'),(4,'/purchase','Как купить нашу гитару? Приобрести гитару Chapman в Минске можно в нашем шоу-руме, располагающемся по адресу ул. Скрыганова, 14 Осуществляем доставку инструментов следующими способами: Курьером по Минску Доставка прямо к порогу по г. Минску. Компетентная консультация. Срок доставки: от 2 до 6 часов, при заказе до 17:00 Стоимость доставки: Бесплатно Почтой по Беларуси Доставка в любую точку Республики Беларусь по почте наложенным платежом. Срок доставки: от 2 до 3 дней Стоимость доставки: Бесплатно Ускоренной почтой EMS по Беларуси Доставка в любую точку Республики Беларусь службой доставки EMS до порога. Срок доставки: до 24 часов Стоимость доставки: 3% от суммы + вес товара','2020-06-02 13:01:53','2020-06-02 13:01:53'),(5,'/contact','Есть вопросы? Позвоните нам! +375-(17)-270-70-70 +375-(29)-570-70-70 ..или отправьте сообщение Ваше имя* Адрес электронной почты* Номер телефона Ваше сообщение* *Обязательные для заполнения поля Отправьте нам сообщение','2020-06-02 13:01:53','2020-06-02 13:01:53'),(6,'/search','Поиск по сайту Champan Guitars','2020-06-02 13:01:53','2020-06-02 13:01:53'),(7,'/guitar/ml1-m','Chapman ML1 Modern Спецификация Колки Закрытые Chapman Classic (18:1) Гриф Клён с матовым финишем Накладка Макассарский эбен Лады 24 джамбо лада (никель) Мензура, мм 648 Дека Махогани Нековый звукосниматель Chapman Sonorous Zerø Humbucker Бриджевый звукосниматель Chapman Sonorous Zerø Humbucker Бридж Хардтейл (струны сквозь корпус) Вес, г 3500 Доступные цвета','2020-06-02 13:01:53','2020-06-02 13:01:53'),(8,'/guitar/ml2-m','Chapman ML2 Modern Спецификация Колки Закрытые Chapman Classic (18:1) Гриф Клён с матовым финишем Накладка Макассарский эбен Лады 24 джамбо лада (никель) Мензура, мм 635 Дека Махогани Нековый звукосниматель Chapman Stentorian Zerø Humbucker Бриджевый звукосниматель Chapman Stentorian Zerø Humbucker Бридж Tune-o-matic со стоп-баром Вес, г 3500 Доступные цвета','2020-06-02 13:01:53','2020-06-02 13:01:53'),(9,'/guitar/mlv-m','Chapman MLV Modern Спецификация Колки Локовые Hipshot (18:1) Гриф Махогани с матовым финишем Накладка Индийский эбен Лады 224 джамбо лада (нержавеющая сталь) Мензура, мм 648 Дека Махогани Нековый звукосниматель Chapman Stentorian Humbucke Бриджевый звукосниматель Chapman Stentorian Humbucke Бридж Тремоло Floyd Rose Вес, г 3750 Доступные цвета','2020-06-02 13:01:53','2020-06-02 13:01:53'),(10,'/artist/felix-hagan','Артисты Chapman - Felix Hagan Феликс - основатель группы из 7 участников Felix Hagan & The Family. Ребята экспериментируют в жанрах new-glam, high camp pop, панк, классический рок.','2020-06-02 13:01:53','2020-06-02 13:01:53'),(11,'/artist/leo-moracchioli','Артисты Chapman - Leo Moracchioli Лео - норвежский музыкант, основатель Frog Leap Studios. Записывает музыку, продюсирует группы, выступает вживую. Запустил канал на YouTube с кавера на песню Lady Gaga - Poker Face, набравшего почти 9 миллиона просмотров, после чего активно развивается на данной платформе.','2020-06-02 13:01:53','2020-06-02 13:01:53'),(12,'/artist/rabea-massaad','Артисты Chapman - Rabea Massaad Рабеа - гитарист групп Dorje (#1 в рок чарте Великобритании в 2015 году) и Toska (#1 в мировом чартеBandcamp). Занимался музыкой с детских лет - в 8 лет он сел за барабанную установку, а в 15 взялся за гитару.Участвовал в разработке многих гитар Chapman.','2020-06-02 13:01:53','2020-06-02 13:01:53'),(13,'/artist/rob-chapman','Артисты Chapman - Rob Chapman Роб - гитарист из Брайтона, Великобритания. Основатель Chapman Guitars, фронтмен группы Dorje, обозреватель для магазина Andertons Music.','2020-06-02 13:01:53','2020-06-02 13:01:53'),(14,'/artist/rob-scallon','Артисты Chapman - Rob Scallon Роб - талантливый музыкант-мультиинструменталист. Его видео и каверы на популярные песни на необычных инструментах (например Slipknot - Psychosocial на банжо) завоевали уже более 1 миллиона человек. Любимым инструментом Роба все же остается его 8-струнная гитара Chapman.','2020-06-02 13:01:53','2020-06-02 13:01:53');
/*!40000 ALTER TABLE `searchablepages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `userId` (`userId`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','f4b8350d24fd719d015b95f3440b58dfd5b3c7537980abd82b614047283d145e64b5bc9d853f02166834b8e6453edf88243db6fbfb97978254c90440b55ff5e5');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-02 16:03:14
