export default {
  db: {
    uri: "postgres://postgres@localhost:5432/grubgrab",
    sequelize: {
      dialect: "postgres",
      operatorsAliases: false,
      logging: false
    }
  }
};
