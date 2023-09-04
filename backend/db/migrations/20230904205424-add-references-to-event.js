'use strict';
let options = {}

if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    options.tableName = "Events"
    await queryInterface.addColumn("Events", 'venueId', {
      type: Sequelize.INTEGER,
      references: {model: 'Venues'},

      },
    )
    await queryInterface.addColumn("Events", 'groupId', {
      type: Sequelize.INTEGER,
      references: {model: 'Groups'},
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    options.tableName = "Events"
    await queryInterface.removeColumn("Events", 'venueId')
    await queryInterface.removeColumn("Events", 'groupId')
  }
};
