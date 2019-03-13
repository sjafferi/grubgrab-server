import Jwt from "@platform/auth/jwt";
import Errors from "@platform/common/errors";
import joi from "@platform/common/joi";
import db from "@platform/common/sequelize";
import bcrypt from "bcrypt";
import Sequelize from "sequelize";
import uuid from "uuid/v4";

export type IRole = "admin" | "customer" | "restaurant";

export const UserSchema = joi.object().keys({
  phone: joi
    .string()
    .regex(/^(\(\d{3}\) |\d{3}-)\d{3}-\d{4}$/),
  email: joi.string().email().required(),
  role: joi
    .string()
    .valid(["admin", "customer", "restaurant"])
    .required(),
  password: joi.string().required(),
  city: joi.string()
});

export const UserLoginSchema = joi.object().keys({
  email: joi
    .string()
    .email()
    .required(),
  role: joi
    .string()
    .valid(["admin", "customer", "restaurant"])
    .required(),
  password: joi.string().required()
});

export interface IUser {
  id?: string;
  email: string;
  phone: string;
  role: IRole;
  password: string;
  city: string;
}

type UserInstance = Sequelize.Instance<IUser> & IUser;
type UserModel = Sequelize.Model<UserInstance, IUser>;

class User {
  attributes: SequelizeAttributes<IUser> = {
    id: { type: Sequelize.STRING, primaryKey: true },
    email: { type: Sequelize.STRING, allowNull: false },
    phone: { type: Sequelize.STRING },
    role: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    city: { type: Sequelize.STRING }
  };
  model: UserModel;

  constructor() {
    this.model = db.sequelize.define("user", this.attributes);
  }

  create = async (user: IUser): Promise<IUser> => {
    const existingEmail = await this.model.findOne({
      where: { email: user.email },
      attributes: ["id"]
    });

    if (existingEmail) {
      throw new Errors.PlatformError(
        `${user.email} email already exists. Enter a new one.`
      );
    }

    const hash = await this.generateHash(user.password);
    user.password = hash;
    user.id = uuid();
    const User = (await this.model.create(user)).toJSON() as IUser;
    delete User.password;

    return User;
  };

  findOne = async (user: Partial<IUser>) => {
    let password;
    if (user.password) {
      password = user.password;
      delete user.password;
    }

    const User = await this.model.findOne({
      where: user
    });

    if (!User) {
      throw new Errors.UnauthorizedAccessError("User does not exist");
    }

    if (password && !this.validPassword(User.password, password)) {
      throw new Errors.UnauthorizedAccessError("Incorrect password");
    }

    const UserObject = User.toJSON();
    delete UserObject.password;

    return UserObject;
  };

  findByIds = async (ids: string[]) => {
    const results = await Promise.all(ids.map(id => this.findOne({ id })));

    return results.map(({ id }) => id);
  }

  generateToken = (user: IUser) => {
    // should check cache
    return Jwt.sign(user);
  };

  private generateHash = (password: string) => {
    return bcrypt.hash(password, bcrypt.genSaltSync(8));
  };

  private validPassword = (p1: string, p2: string) => bcrypt.compare(p1, p2);
}

const user = new User();
Object.freeze(user);
export default user;
