import express from 'express'
const router = express.Router()
import upload from '../config/cloudinary.js'
import {
  fetchCart,
  updateCart,
  deleteCart,
  addCart
} from '../controller/cart.js'
import { uploadProduct } from '../controller/upload.js'
import { fetchProducts } from '../controller/product.js'
router.get('/products', fetchProducts)
router.get('/cart', fetchCart)
router.post('/cart', addCart)
router.put('/cart', updateCart)
router.delete('/cart', deleteCart)
router.post('/upload',upload.single('image'), uploadProduct)

export default router
