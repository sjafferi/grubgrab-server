import Errors from "@platform/common/errors";
import joi from "@platform/common/joi";
import db from "@platform/common/sequelize";
import Sequelize from "sequelize";
import uuid from "uuid/v4";

import FoodCategory, { FoodCategorySchema, IFoodCategory } from "./FoodCategory";
import Restaurant from "./Restaurant";

export const FoodItemSchema = joi.object().keys({
  name: joi.string().required(),
  description: joi.string().allow(""),
  priceCents: joi.number().required(),
  calories: joi.number(),
  type: joi.string().valid("entree", "side", "dessert").required(),
  category: FoodCategorySchema
});

export const FoodItemsSchema = joi.array().items(FoodItemSchema);

export type IFoodType = "entree" | "side" | "dessert";

export interface IFoodItem {
  id?: string,
  name: string,
  description: string,
  priceCents: number,
  calories: number,
  type: IFoodType,
  category?: IFoodCategory,
}

type FoodItemInstance = Sequelize.Instance<IFoodItem> & IFoodItem & {
  setRestaurant: (restaurantId: string) => void,
  setCategory: (categoryId: string) => void,
};
type FoodItemModel = Sequelize.Model<FoodItemInstance, IFoodItem>;

class FoodItem {
  attributes: SequelizeAttributes<IFoodItem> = {
    id: { type: Sequelize.STRING, primaryKey: true },
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    priceCents: { type: Sequelize.INTEGER },
    calories: { type: Sequelize.INTEGER },
    type: { type: Sequelize.STRING },
  };
  model: FoodItemModel;

  constructor() {
    this.model = db.sequelize.define("food_items", this.attributes);
    this.associations();
  }

  create = async (restaurantId: string, foodItem: IFoodItem) => {
    // could validate restaurant existence here too
    // const existingName = await this.model.findOne({
    //   where: { name: foodItem.name },
    //   attributes: ["id"]
    // });

    // if (existingName) {
    //   throw new Errors.PlatformError(
    //     `Food item ${foodItem.name} already exists. Enter a new one.`
    //   );
    // }

    let category;
    if (foodItem.category) {
      category = (await FoodCategory.upsert([foodItem.category]))[0];
      delete foodItem.category;
    }

    foodItem.id = uuid();

    const FoodItemInstance = await this.model.create(foodItem);
    FoodItemInstance.setRestaurant(restaurantId);

    if (category) {
      FoodItemInstance.setCategory(category.id);
    }

    return { ...(FoodItemInstance.toJSON()), category };
  };

  createMany = async (restaurantId: string, foodItems: IFoodItem[]) => {
    const restaurant = await Restaurant.model.findOne({
      where: { id: restaurantId },
      attributes: ["id"]
    });
    if (!restaurant) {
      throw new Errors.PlatformError(`${restaurantId} does not exists.`);
    }

    // partial failure could result in double add
    const promises = foodItems.map(item => this.create(restaurantId, item));
    const values = (await Promise.all(promises));

    return values;
  }

  findOne = async (foodItem: Partial<IFoodItem>) => {
    const FoodItem = await this.model.findOne({
      where: foodItem,
      include: this.includes
    });

    if (!FoodItem) {
      throw new Errors.NotFoundError("Food item does not exist");
    }

    return FoodItem;
  };

  findAll = async (restaurantId: string) => {
    const items = await this.model.findAll({ where: { restaurantId }, include: this.includes });
    return items;
  };

  get includes(): Sequelize.IncludeOptions[] {
    return [
      {
        model: FoodCategory.model,
        as: "category",
        attributes: ['name', 'description'],
        required: false,
      }
    ]
  }

  associations = () => {
    this.model.belongsTo(FoodCategory.model, {
      as: "category",
      foreignKey: "categoryId"
    });
  }
}

const user = new FoodItem();
Object.freeze(user);
export default user;
