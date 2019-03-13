import db from "@platform/common/sequelize";
import Sequelize from "sequelize";
import uuid from "uuid/v4";

export interface IFoodCategory {
  id?: string;
  name: string;
  description?: string;
}

type FoodCategoryInstance = Sequelize.Instance<IFoodCategory> & IFoodCategory;
type FoodCategoryModel = Sequelize.Model<FoodCategoryInstance, IFoodCategory>;

class FoodCategory {
  attributes: SequelizeAttributes<IFoodCategory> = {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING }
  };
  model: FoodCategoryModel;

  constructor() {
    this.model = db.sequelize.define("food_categories", this.attributes);

    this.associations();
  }

  create = async (category: IFoodCategory) => {
    const FoodCategory = await this.model.create(category);

    return FoodCategory;
  };

  upsert = async (categories: string[]) => {
    const results = await Promise.all(categories.map(category => this.model.upsert({ name: category }, { returning: true })));

    return results.map(result => result[0].toJSON());
  };

  associations = () => {

  }
}

const foodCategory = new FoodCategory();
Object.freeze(foodCategory);
export default foodCategory;
