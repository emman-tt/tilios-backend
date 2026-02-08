import { Product } from './products.js'
import { Category } from './category.js'
import { User } from './user.js'
import { Cart } from './cart.js'
import { sequelize } from '../config/sql.js'
import { CartProduct } from './cartProduct.js'
import { Sales } from './sales.js'

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

Sales.belongsTo(Sales, {
  foreignKey: 'productId'
})

export async function setupDB () {
  try {
    // await sequelize.sync()
    // const discounts = []
    // for (let i = 1; i <= 24; i++) {
    //   discounts.push({
    //     productId: i,
    //     sold_units: Math.floor(Math.random() * 100) + 1
    //     // createdAt: new Date(),
    //     // updatedAt: new Date()
    //   })
    // }
    // await Sales.bulkCreate(fakeSales)
    // await sequelize.sync({ alter: true })
  } catch (error) {
    console.log('database error', error.message)
  }
}
