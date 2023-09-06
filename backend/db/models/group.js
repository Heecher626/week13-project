'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Membership, {foreignKey: 'groupId'})
      Group.hasMany(models.Event, {foreignKey: 'groupId'})
      Group.hasMany(models.Venue, {foreignKey: 'groupId'})
      Group.hasMany(models.GroupImage, {foreignKey: 'groupId'})
      Group.belongsTo(models.User, {foreignKey: 'organizerId'})
      Group.belongsToMany(models.User, {through: models.Membership, foreignKey: 'groupId', otherKey: 'userId', as: 'members'})
      Group.belongsToMany(models.Venue, {through: models.Event, foreignKey: 'groupId', otherKey: 'venueId', as: 'eventVenues'})
    }
  }
  Group.init({
    organizerId: { type: DataTypes.INTEGER},
    name: { type: DataTypes.STRING, allowNull: false},
    about: { type: DataTypes.STRING, allowNull: false},
    type: { type: DataTypes.ENUM(['In person', 'Online']), allowNull: false},
    private: { type: DataTypes.BOOLEAN, allowNull: false},
    city: { type: DataTypes.STRING},
    state: { type: DataTypes.STRING}
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};