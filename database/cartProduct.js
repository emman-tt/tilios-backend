import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sql.js'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
export const CartProduct = sequelize.define('cartProduct', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})
