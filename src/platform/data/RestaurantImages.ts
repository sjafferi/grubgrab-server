import joi from "@platform/common/joi";
import db from "@platform/common/sequelize";
import { Cloudinary, ICloudinaryImage } from '@platform/services'
import Sequelize from "sequelize";

export const RestaurantImagesSchema = joi.object().keys({
  url: joi.string().required(),
  description: joi.string(),
});

export interface IRestaurantImages {
  id?: string;
  hostId?: string;
  url: string;
  description: string;
}

type RestaurantImagesInstance = Sequelize.Instance<IRestaurantImages> & IRestaurantImages;
type RestaurantImagesModel = Sequelize.Model<RestaurantImagesInstance, IRestaurantImages>;

class RestaurantImages {
  attributes: SequelizeAttributes<IRestaurantImages> = {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING },
    hostId: { type: Sequelize.STRING },
  };
  model: RestaurantImagesModel;

  constructor() {
    this.model = db.sequelize.define("restaurant_images", this.attributes);

    this.associations();
  }

  create = async (category: IRestaurantImages) => {
    const RestaurantImages = await this.model.create(category);

    return RestaurantImages;
  };

  upsert = async (images: IRestaurantImages[]) => {
    const processed = await Promise.all(images.map(image => this.beforeCreateOrUpdate(image)));

    const results = await Promise.all(processed.map(image => this.model.upsert(image, { returning: true })));

    return results.map(result => result[0].toJSON());
  };

  beforeCreateOrUpdate = async (image: IRestaurantImages) => {
    const result = await Cloudinary.createImage(image.url);
    if (result) {
      image.hostId = (result as ICloudinaryImage).public_id;
      image.url = (result as ICloudinaryImage).url;
    }
    return image;
  }

  associations = () => {

  }
}

const foodCategory = new RestaurantImages();
Object.freeze(foodCategory);
export default foodCategory;
