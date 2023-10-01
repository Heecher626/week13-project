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
   options.tableName = 'EventImages'
   await queryInterface.bulkInsert(options, [{
    eventId: 1,
    url: 'https://media.istockphoto.com/id/535262557/photo/3d-penguin-takes-a-photo.jpg?s=1024x1024&w=is&k=20&c=IfDhjQqkGRIiIQF7Qq9yy3bQOG9NW3Gy619k-0blP90=',
    preview: true
   },
  {
    eventId: 2,
    url: 'https://ih1.redbubble.net/image.1716380381.1766/st,small,507x507-pad,600x600,f8f8f8.jpg',
    preview: true
  }], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'EventImages'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: ['temp']
      }
    }, {})
  }
};
