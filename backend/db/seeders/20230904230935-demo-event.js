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
    venueId: 1,
    groupId: 1,
    name: 'Penguin pics',
    description: 'Come look at some pictures of penguins with us! Bring your cutest ones!',
    type: 'Online',
    capacity: 5,
    price: 10,
    startDate: "2023-10-25 18:00:00.000",
    endDate: "2023-10-25 20:00:00.000"
   },
   {
    venueId: 1,
    groupId: 1,
    name: 'Penguin stories',
    description: 'Share some stories about why you love penguins! The best one wins a prize!',
    type: 'Online',
    capacity: 5,
    price: 10,
    startDate: "2023-10-24 18:00:00.000",
    endDate: "2023-10-24 20:00:00.000"
   },
   {
    venueId: 1,
    groupId: 1,
    name: 'Past penguin event',
    description: 'This is an event about penguins that\'s in the past. If you have a time machine feel free to come hang out!',
    type: 'Online',
    capacity: 5,
    price: 10,
    startDate: "2023-9-25 18:00:00.000",
    endDate: "2023-9-25 20:00:00.000"
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
      groupId: {
        [Op.in]: [1]
      }
    }, {})
  }
};
