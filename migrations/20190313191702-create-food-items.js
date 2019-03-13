'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.createTable('food_items', {
      id: { type: Sequelize.STRING, primaryKey: true },
      restaurantId: { type: Sequelize.STRING },
      categoryId: { type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      priceCents: { type: Sequelize.INTEGER },
      calories: { type: Sequelize.INTEGER },
      type: { type: Sequelize.STRING },
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
    return queryInterface.dropTable('food_items');
  }
};
