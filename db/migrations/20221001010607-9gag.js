'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.createTable('GagMemes', {
      id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true,
      },

      originalUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },

      type: {
        type: DataTypes.ENUM('video', 'image'),
        allowNull: false,
      },

      mediaUrl: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
      },

      title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      crawledAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },

      deletedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('GagmMeme');
  }
};
