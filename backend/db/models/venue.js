'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(models.Event, {foreignKey: 'venueId', onDelete: 'CASCADE'})
      Venue.belongsTo(models.Group, {foreignKey: 'groupId', onDelete: 'CASCADE'})
      Venue.belongsToMany(models.Group, {through: models.Event, foreignKey: 'venueId', otherKey: 'groupId', as: 'groupVenue', onDelete: 'CASCADE'})
    }
  }
  Venue.init({
    groupId: {type: DataTypes.INTEGER},
    address: {type: DataTypes.STRING},
    city: {type: DataTypes.STRING},
    state: {type: DataTypes.STRING},
    lat: {type: DataTypes.DOUBLE},
    lng: {type: DataTypes.DOUBLE}
  }, {
    sequelize,
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    modelName: 'Venue',
  });
  return Venue;
};
