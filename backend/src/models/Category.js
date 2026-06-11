const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/database')

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#6366f1'
  }
},{
  tableName: 'categories',
  timestamps: true
})

module.exports = Category