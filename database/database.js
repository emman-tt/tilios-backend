import { Product } from './products.js'
import { Category } from './category.js'
import { User } from './user.js'
import { Cart } from './cart.js'
import { sequelize } from '../config/sql.js'
import { CartProduct } from './cartProduct.js'
import { Sales } from './sales.js'
import { Order } from './orders.js'
import { Transaction } from './transactions.js'

User.hasOne(Cart, {
  onDelete: 'CASCADE',
  foreignKey: 'userId'
})
Cart.belongsTo(User, {
  foreignKey: 'userId'
})

Cart.belongsToMany(Product, {
  through: CartProduct,
  foreignKey: 'cartId',
  otherKey: 'productId'
})

Product.belongsToMany(Cart, {
  through: CartProduct,
  foreignKey: 'productId',
  otherKey: 'cartId'
})

CartProduct.belongsTo(Product, { foreignKey: 'productId' })
Product.hasMany(CartProduct, { foreignKey: 'productId' })

User.hasMany(Order, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})

Order.belongsTo(User, {
  foreignKey: 'userId'
})

Order.hasMany(Transaction, {
  foreignKey: 'orderId'
})

Transaction.belongsTo(Order, {
  foreignKey: 'orderId'
})

Category.hasMany(Product, {
  foreignKey: 'categoryId'
})

Product.belongsTo(Category, {
  foreignKey: 'categoryId'
})

Product.hasOne(Sales, {
  onDelete: 'CASCADE',
  foreignKey: 'productId',
  as: 'saleProducts'
})

Sales.belongsTo(Product, {
  foreignKey: 'productId'
})

export async function setupDB () {
  try {
    // await sequelize.sync({ alter: true }) 
  } catch (error) {
    console.log('database error', error.message)
  }
}
