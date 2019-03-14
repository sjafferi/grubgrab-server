export default {
  db: {
    uri: process.env.DATABASE_URL,
    sequelize: {
      dialect: "postgres",
      operatorsAliases: false,
      logging: false
    }
  }
};
