import * as cloudinary from 'cloudinary';
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export interface ICloudinaryImage {
  public_id: string;
  url: string;
}

export interface ICloudinaryError {
  message: string;
}

class Cloudinary {
  createImage = (url: string): Promise<ICloudinaryImage | ICloudinaryError> => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(url, (error: ICloudinaryError, result: ICloudinaryImage) => {
        if (error) reject(error);
        else resolve(result);
      });
    })
  }
}

const cloudinaryInstance = new Cloudinary();
Object.freeze(cloudinaryInstance);
export default cloudinaryInstance;
