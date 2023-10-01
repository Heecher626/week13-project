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
   options.tableName = 'GroupImages'
   await queryInterface.bulkInsert(options, [{
    groupId: 1,
    url: 'https://i.natgeofe.com/k/88de42b8-764c-40d2-89ee-e72d55dc95b8/emperor-penguin-chicks.jpg',
    preview: true
   },
   {
    groupId: 2,
    url:'https://www.creativefabrica.com/wp-content/uploads/2021/10/23/Cute-Angry-Penguin-Face-Illustration-Graphics-19152731-1.jpg',
    preview: true
   },
  {
    groupId: 3,
    url: 'https://cdn.drawception.com/images/panels/2017/12-25/NHYAXMXDyt-2.png',
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
    options.tableName = 'GroupImages'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options, {
      groupId: {
        [Op.in]: [1, 2, 3]
      }
    }, {})
  }
};
