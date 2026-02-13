import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sql.js'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
export const OrderItem = sequelize.define('orderItem', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
    //order status - pending, paid, shipped, delivered(success)
    //             -pending,failed,cancelled
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: false
  }
})


