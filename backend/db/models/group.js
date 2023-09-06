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
      Group.hasMany(models.Membership, {foreignKey: 'groupId', onDelete: 'CASCADE'})
      Group.hasMany(models.Event, {foreignKey: 'groupId', onDelete: 'CASCADE'})
      Group.hasMany(models.Venue, {foreignKey: 'groupId', onDelete: 'CASCADE'})
      Group.hasMany(models.GroupImage, {foreignKey: 'groupId', onDelete: 'CASCADE'})
      Group.belongsTo(models.User, {foreignKey: 'organizerId', as: 'Organizer', onDelete: 'CASCADE'})
      Group.belongsToMany(models.User, {through: models.Membership, foreignKey: 'groupId', otherKey: 'userId', as: 'members', onDelete: 'CASCADE'})
      Group.belongsToMany(models.Venue, {through: models.Event, foreignKey: 'groupId', otherKey: 'venueId', as: 'eventVenues', onDelete: 'CASCADE'})
    }
  }
  Group.init({
    organizerId: { type: DataTypes.INTEGER},
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 60]
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [50, 1000]
      }
    },
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
