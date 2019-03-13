module.exports = {
  development: {
    url: "postgres://postgres@localhost:5432/grubgrab",
    dialect: 'postgres'
  },
  production: {
    uri: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
};