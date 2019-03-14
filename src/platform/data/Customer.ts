import Errors from "@platform/common/errors";
import joi from "@platform/common/joi";
import db from "@platform/common/sequelize";
import Sequelize from "sequelize";

import User, { IUser, UserSchema } from './User';

export const CustomerSchema = UserSchema.keys({
  role: joi.string().valid(["customer"]).required()
});

export interface ICustomer extends IUser {
  id?: string;
}

type CustomerInstance = Sequelize.Instance<ICustomer> & ICustomer & {
  setUser: (id: number) => void
};

type CustomerModel = Sequelize.Model<CustomerInstance, ICustomer>;

class Customer {
  attributes: SequelizeAttributes<Partial<ICustomer>> = {
    // id: { type: Sequelize.STRING, primaryKey: true }
  };
  model: CustomerModel;

  constructor() {
    this.model = db.sequelize.define("customers", this.attributes, { timestamps: false });
    this.associations();
  }

  create = async (customer: ICustomer) => {
    const UserInstance = await User.create(customer);

    const CustomerInstance = (await this.model.create({ id: UserInstance.id } as IUser)).toJSON();

    return { ...UserInstance, ...CustomerInstance };
  };

  associations = () => {
    this.model.belongsTo(User.model, {
      as: "user",
      foreignKey: "id",
      onDelete: 'CASCADE'
    });
  }
}

const user = new Customer();
Object.freeze(user);
export default user;
