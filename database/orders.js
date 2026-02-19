import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sql.js'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
export const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  //this is now for the transaction if it exists its paid else unpaid
  // status: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  //   //order status - pending, paid, unpaid
  // },
  payment_status: {
    type: DataTypes.STRING,
    allowNull: false
    // status - confirmed, pending ,cancelled
  },
  order_status: {
    type: DataTypes.STRING,
    allowNull: false
    // status - pending, dispatched, delivered ,cancelled
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_details: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  stripeSessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    // unique: true,
    comment: 'The unique ID from Stripe Checkout'
  }
})
