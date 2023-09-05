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
   options.tableName = 'Venues'
   await queryInterface.bulkInsert(options, [{
    groupId: 1,
    address: 'Insert address',
    city: "Boston",
    state: 'Massachusetts',
    lat: '5.3',
    lng: '6.2'
   }], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Venues'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {
      address: {
        [Op.in]: ['Insert address']
      }
    }, {})
  }
};
