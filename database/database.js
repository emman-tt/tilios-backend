import { Product } from './products.js'
import { Category } from './category.js'
import { User } from './user.js'
import { Cart } from './cart.js'
import { sequelize } from '../config/sql.js'
import { CartProduct } from './cartProduct.js'

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
export async function setupDB () {
  try {
    // await Category.bulkCreate([
    //   {
    //     name: 'Ceramic'
    //   },
    //   {
    //     name: 'Porcelain'
    //   },
    //   {
    //     name: 'Stone'
    //   },
    //   {
    //     name: 'Glass'
    //   }
    // ])
    // await sequelize.sync({alter:true})
    await sequelize.sync()
  } catch (error) {
    console.log('database error', error.message)
  }
}
