import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sql'

export const Transaction = sequelize.define('transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  }
})
