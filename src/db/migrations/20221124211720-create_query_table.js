"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("queries", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      client_ip: { type: Sequelize.DataTypes.STRING, validate: { isIP: true } },
      domain: { type: Sequelize.DataTypes.STRING, allowNull: false },
      addresses: { type: Sequelize.DataTypes.JSON, allowNull: false },
      createdAt: Sequelize.DataTypes.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("queries");
  },
};
