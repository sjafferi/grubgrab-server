// tslint:disable ordered-imports
import Errors from "@platform/common/errors";
import joi from "@platform/common/joi";
import db from "@platform/common/sequelize";
import Sequelize from "sequelize";
import uuid from "uuid/v4";

import User, { IUser, UserSchema } from './User';
import FoodItem from './FoodItem';

export const RestaurantSchema = joi.object().keys({
  name: joi.string().required(),
  city: joi.string().required(),
  address: joi.string(),
  owner: UserSchema.keys({
    role: joi.string().valid(["restaurant"]).required()
  })
});

export interface IRestaurant {
  id?: string,
  owner?: IUser,
  name: string,
  city: string,
  address: string,
  description: string,
}

type RestaurantInstance = Sequelize.Instance<IRestaurant> & IRestaurant & {
  setOwner: (userId: string) => void
};
type RestaurantModel = Sequelize.Model<RestaurantInstance, IRestaurant>;

class Restaurant {
  attributes: SequelizeAttributes<Partial<IRestaurant>> = {
    id: { type: Sequelize.STRING, primaryKey: true },
    name: { type: Sequelize.STRING },
    city: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    // description: { type: Sequelize.STRING }
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

    const RestaurantInstance = (await this.model.create(restaurant));
    RestaurantInstance.setOwner(UserInstance.id)

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
    return restaurants;
  };

  get includes(): Sequelize.IncludeOptions[] {
    return [
      {
        model: User.model,
        as: 'owner',
        required: false,
        attributes: ['email', 'id']
      },
      {
        model: FoodItem.model,
        as: "menu",
        required: false,
        attributes: ['name', 'description', 'priceCents', 'id', 'calories', 'type'],
        include: FoodItem.includes
      }
    ]
  }

  associations = () => {
    this.model.belongsTo(User.model, {
      as: "owner",
      foreignKey: "ownerId",
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
