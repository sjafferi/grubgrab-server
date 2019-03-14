import joi from "@platform/common/joi";
import db from "@platform/common/sequelize";
import Sequelize from "sequelize";

export const FoodCategorySchema = joi.object().keys({
  name: joi.string().required(),
  description: joi.string().allow(""),
});

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

  upsert = async (categories: IFoodCategory[]) => {
    const results = await Promise.all(categories.map(category => this.model.upsert(category, { returning: true })));

    return results.map(result => result[0].toJSON());
  };

  associations = () => {

  }
}

const foodCategory = new FoodCategory();
Object.freeze(foodCategory);
export default foodCategory;
