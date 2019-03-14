import db from "@platform/common/sequelize";
import Sequelize from "sequelize";

export interface IRestaurantCategory {
  id?: string;
  name: string;
  description?: string;
}

type RestaurantCategoryInstance = Sequelize.Instance<IRestaurantCategory> & IRestaurantCategory;
type RestaurantCategoryModel = Sequelize.Model<RestaurantCategoryInstance, IRestaurantCategory>;

class RestaurantCategory {
  attributes: SequelizeAttributes<IRestaurantCategory> = {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING }
  };
  model: RestaurantCategoryModel;

  constructor() {
    this.model = db.sequelize.define("restaurant_categories", this.attributes);

    this.associations();
  }

  create = async (category: IRestaurantCategory) => {
    const RestaurantCategory = await this.model.create(category);

    return RestaurantCategory;
  };

  upsert = async (categories: string[]) => {
    const results = await Promise.all(categories.map(category => this.model.upsert({ name: category }, { returning: true })));

    return results.map(result => result[0].toJSON());
  };

  associations = () => {

  }
}

const foodCategory = new RestaurantCategory();
Object.freeze(foodCategory);
export default foodCategory;
