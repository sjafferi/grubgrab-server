import config from "config";
import Sequelize from "sequelize";

declare global {
  type SequelizeAttributes<T extends { [key: string]: any }> = {
    [P in keyof T]:
    | string
    | Sequelize.DataTypeAbstract
    | Sequelize.DefineAttributeColumnOptions
  };
}

class DatabaseConnection {
  sequelize: Sequelize.Sequelize;

  constructor() {
    this.sequelize = new Sequelize(config.db.uri, { dialect: config.db.sequelize.dialect });
  }
}

const instance = new DatabaseConnection();
Object.freeze(instance);

export default instance;
