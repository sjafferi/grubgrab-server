'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.createTable('restaurants', {
      id: { type: Sequelize.STRING, primaryKey: true },
      ownerId: { type: Sequelize.STRING },
      name: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
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
    return queryInterface.dropTable('restaurants');
  }
};
