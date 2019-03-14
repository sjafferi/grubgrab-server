// tslint:disable ordered-imports
import Errors from "@platform/common/errors";
import joi from "@platform/common/joi";
import db from "@platform/common/sequelize";
import Sequelize from "sequelize";
import uuid from "uuid/v4";

import User, { IUser, UserSchema } from './User';
import RestaurantCategory from './RestaurantCategory';
import RestaurantHours, { IRestaurantHours, RestaurantHoursSchema } from './RestaurantHours'
import RestaurantImages, { IRestaurantImages, RestaurantImagesSchema } from './RestaurantImages'
import FoodItem from './FoodItem';

export const RestaurantSchema = joi.object().keys({
  name: joi.string().required(),
  city: joi.string().required(),
  address: joi.string(),
  postalCode: joi.string(),
  longitude: joi.number().precision(8),
  latitude: joi.number().precision(8),
  owner: UserSchema.keys({
    role: joi.string().valid(["restaurant"]).required()
  }),
  categories: joi.array().items(joi.string()),
  hours: joi.array().items(RestaurantHoursSchema),
  images: joi.array().items(RestaurantImagesSchema)
});

export interface IRestaurant {
  id?: string,
  owner?: IUser,
  name: string,
  city: string,
  address: string,
  postalCode: string,
  longitude: number,
  latitude: number,
  description: string,
  categories?: string[],
  hours?: IRestaurantHours[],
  images?: IRestaurantImages[],
}

type RestaurantInstance = Sequelize.Instance<IRestaurant> & IRestaurant & {
  setOwner: (userId: string) => void
  setCategories: (catIds: string[]) => void
  setHours: (hourIds: string[]) => void
  setImages: (imageIds: string[]) => void
};
type RestaurantModel = Sequelize.Model<RestaurantInstance, IRestaurant>;

class Restaurant {
  attributes: SequelizeAttributes<Partial<IRestaurant>> = {
    id: { type: Sequelize.STRING, primaryKey: true },
    name: { type: Sequelize.STRING },
    city: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    postalCode: { type: Sequelize.STRING },
    longitude: { type: Sequelize.FLOAT },
    latitude: { type: Sequelize.FLOAT },
    description: { type: Sequelize.STRING }
  };
  model: RestaurantModel;

  constructor() {
    this.model = db.sequelize.define("restaurants", this.attributes);
    this.associations();
  }

  create = async (restaurant: IRestaurant) => {
    restaurant.id = uuid();

    const UserInstance = await User.create(restaurant.owner);
    delete restaurant.owner;

    let categories, hours, images;
    if (restaurant.categories) {
      categories = (await RestaurantCategory.upsert(restaurant.categories));
      delete restaurant.categories;
    }

    if (restaurant.hours) {
      hours = (await RestaurantHours.upsert(restaurant.hours));
      delete restaurant.hours;
    }

    if (restaurant.images) {
      images = (await RestaurantImages.upsert(restaurant.images));
      delete restaurant.images;
    }

    const RestaurantInstance = (await this.model.create(restaurant));
    RestaurantInstance.setOwner(UserInstance.id);

    if (categories) {
      RestaurantInstance.setCategories(categories.map(cat => cat.id));
    }

    if (hours) {
      RestaurantInstance.setHours(hours.map(hour => hour.id));
    }

    if (images) {
      RestaurantInstance.setImages(images.map(image => image.id));
    }

    return { ...(RestaurantInstance.toJSON()), owner: UserInstance };
  };

  findOne = async (restaurant: Partial<IRestaurant>) => {
    const Restaurant = await this.model.findOne({
      where: restaurant,
      include: this.includes
    });

    if (!Restaurant) {
      throw new Errors.NotFoundError("Restaurant does not exist");
    }

    return Restaurant;
  };

  findAll = async () => {
    const restaurants = await this.model.findAll({ include: this.includes });
    return restaurants.map(this.afterFind);
  };

  afterFind = (Restaurant: RestaurantInstance) => {
    const result = Restaurant.toJSON() as IRestaurant;

    if (result.categories) {
      result.categories = (result.categories as any).map(({ name }: any) => name);
    }

    return result;
  }

  get includes(): Sequelize.IncludeOptions[] {
    return [
      {
        model: User.model,
        as: 'owner',
        required: false,
        attributes: ['email', 'id']
      },
      {
        model: RestaurantCategory.model,
        as: 'categories',
        required: false,
        attributes: ['name', 'description'],
        through: { attributes: [] }
      },
      // {
      //   model: FoodItem.model,
      //   as: "menu",
      //   required: false,
      //   attributes: ['name', 'description', 'priceCents', 'id', 'calories', 'type'],
      //   include: FoodItem.includes
      // },
      {
        model: RestaurantHours.model,
        as: "hours",
        required: false,
        attributes: ['day', 'openTime', 'closeTime']
      },
      {
        model: RestaurantImages.model,
        as: "images",
        required: false,
        attributes: ['url', 'description']
      },
    ]
  }

  associations = () => {
    this.model.belongsTo(User.model, {
      as: "owner",
      foreignKey: "ownerId",
      onDelete: 'CASCADE'
    });
    this.model.belongsToMany(RestaurantCategory.model, {
      as: "categories",
      through: "restaurant_has_categories",
      foreignKey: "restaurantId"
    });
    RestaurantCategory.model.belongsToMany(this.model, {
      through: "restaurant_has_categories",
      foreignKey: "categoryId"
    });
    this.model.hasMany(RestaurantHours.model, {
      as: "hours",
    });
    RestaurantHours.model.belongsTo(this.model, {
      as: "restaurant",
      foreignKey: "restaurantId",
      onDelete: 'CASCADE'
    });
    this.model.hasMany(RestaurantImages.model, {
      as: "images",
    });
    RestaurantImages.model.belongsTo(this.model, {
      as: "restaurant",
      foreignKey: "restaurantId",
      onDelete: 'CASCADE'
    });
    this.model.hasMany(FoodItem.model, {
      as: "menu",
    });
    FoodItem.model.belongsTo(this.model, {
      as: "restaurant",
      foreignKey: "restaurantId",
      onDelete: 'CASCADE'
    });
  }
}

const user = new Restaurant();
Object.freeze(user);
export default user;
