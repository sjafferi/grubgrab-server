import joi from "@platform/common/joi";
import db from "@platform/common/sequelize";
import Sequelize from "sequelize";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
export const RestaurantHoursSchema = joi.object().keys({
  day: joi.string().valid(daysOfWeek).required(),
  openTime: joi.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  closeTime: joi.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required(),
});

export interface IRestaurantHours {
  id?: string;
  day: string;
  openTime: string;
  closeTime: string;
}

type RestaurantHoursInstance = Sequelize.Instance<IRestaurantHours> & IRestaurantHours;
type RestaurantHoursModel = Sequelize.Model<RestaurantHoursInstance, IRestaurantHours>;

class RestaurantHours {
  attributes: SequelizeAttributes<IRestaurantHours> = {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    day: { type: Sequelize.STRING, allowNull: false },
    openTime: { type: Sequelize.TIME, allowNull: false },
    closeTime: { type: Sequelize.TIME, allowNull: false },
  };
  model: RestaurantHoursModel;

  constructor() {
    this.model = db.sequelize.define("restaurant_hours", this.attributes);

    this.associations();
  }

  create = async (category: IRestaurantHours) => {
    const RestaurantHours = await this.model.create(category);

    return RestaurantHours;
  };

  upsert = async (hours: IRestaurantHours[]) => {
    const results = await Promise.all(hours.map(hour => this.model.upsert(hour, { returning: true })));

    return results.map(result => result[0].toJSON());
  };

  associations = () => {

  }
}

const foodCategory = new RestaurantHours();
Object.freeze(foodCategory);
export default foodCategory;
