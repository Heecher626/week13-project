'use strict';

const { sequelize } = require('../models');

let {Group} = require('../models')
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
    organizerId: 1,
    name: 'Penguin lovers society',
    about: 'Come together and share your love of penguins with us! A super friendly group of cute flightless bird lovers!',
    type: 'Online',
    private: true,
    city: 'Boston',
    state: 'Massachusetts',
   },
   {
    organizerId: 1,
    name: 'Penguin haters society',
    about: 'Come together and share your hate of penguins with us! A super mean group of ugly flightless bird haters!',
    type: 'Online',
    private: true,
    city: 'Boston',
    state: 'Massachusetts',
   },
   {
    organizerId: 1,
    name: 'Society of people neutral on penguins',
    about: 'Come together and share your indifference of penguins with us! A super boring group of people that don\'t really care about flightless birds!',
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
      organizerId: {
        [Op.in]: [1]
      }
    }, {})
  }
};
