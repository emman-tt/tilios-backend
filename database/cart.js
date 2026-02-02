import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sql.js'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
export const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  }
})
