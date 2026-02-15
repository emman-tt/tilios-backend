import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sql.js'

export const Transaction = sequelize.define('transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  providerReference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
})
