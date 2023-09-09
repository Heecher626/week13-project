'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'})
      Membership.belongsTo(models.Group, {foreignKey: 'groupId', onDelete: 'CASCADE'})
    }
  }
  Membership.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    status: {type: DataTypes.ENUM(['attending','host', 'co-host', 'waitlist', 'pending']), allowNull: false}
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
