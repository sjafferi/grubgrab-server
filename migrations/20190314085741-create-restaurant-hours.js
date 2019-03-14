'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.createTable('restaurant_hours', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      restaurantId: { type: Sequelize.STRING },
      day: { type: Sequelize.STRING, allowNull: false },
      openTime: { type: Sequelize.TIME, allowNull: false },
      closeTime: { type: Sequelize.TIME, allowNull: false },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.dropTable('restaurant_hours');
  }
};
