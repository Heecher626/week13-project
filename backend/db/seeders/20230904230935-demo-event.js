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
   options.tableName = 'Events'
   await queryInterface.bulkInsert(options, [{
    //venueId: 1,
    //groupId: 1,
    name: 'event1',
    description: 'This is an event',
    type: 'Online',
    capacity: 5,
    price: 10,
    startDate: "2023-09-27 18:00:00.000",
    endDate: "2023-09-27 20:00:00.000"
   }], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Events'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ['event1']
      }
    }, {})
  }
};
