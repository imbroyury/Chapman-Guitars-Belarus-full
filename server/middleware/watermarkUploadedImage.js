import path from 'path';
import Jimp from 'jimp';

export const watermarkUploadedImage =
    (shouldResize = false, resizeWidth = 2400) =>
      async (req, res, next) => {
        try {
          const { file } = req;
          const pathToOriginal = path.join('static', 'uploads', file.filename);
          const pathToWatermark = path.join('static', 'images', 'design', 'watermark.png');

          const image = await Jimp.read(pathToOriginal);
          const watermark = await Jimp.read(pathToWatermark);

          if (shouldResize && image.bitmap.width > resizeWidth) {
            image.resize(resizeWidth, Jimp.AUTO);
          }

          image.composite(watermark, 50, image.bitmap.height - watermark.bitmap.height - 50);

          await image.writeAsync(pathToOriginal);

          next();
        } catch(e) {
          next(e);
        }
      };
