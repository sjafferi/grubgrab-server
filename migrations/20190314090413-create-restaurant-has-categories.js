'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.createTable('restaurant_has_categories', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      restaurantId: { type: Sequelize.STRING, allowNull: false },
      categoryId: { type: Sequelize.INTEGER, allowNull: false },
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
    return queryInterface.dropTable('restaurant_has_categories');
  }
};
