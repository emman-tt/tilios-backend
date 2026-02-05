import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sql.js'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
export const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    allowNull:false
  }
})
