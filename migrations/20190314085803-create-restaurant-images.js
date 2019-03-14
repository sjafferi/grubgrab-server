'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.createTable('restaurant_images', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      restaurantId: { type: Sequelize.STRING },
      url: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      hostId: { type: Sequelize.STRING },
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
    return queryInterface.dropTable('restaurant_images');
  }
};
