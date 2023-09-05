'use strict';

const { sequelize } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'Groups'
   await queryInterface.bulkInsert(options, [{
    //organizerId: 1,
    name: 'group1',
    about: 'This is a group',
    type: 'Online',
    private: true,
    city: 'Boston',
    state: 'Massachusetts',
   }], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ['group1']
      }
    }, {})
  }
};
