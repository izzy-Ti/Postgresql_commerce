import express from 'express';
import {upload} from '../config/cloudinary.js'
import userAuth from '../middleware/authMiddleware.js';
import { cart, cartItems, createProduct, deleteById, deleteCart, filterProduct, getAll, getById, updateProduct } from '../controller/productController.js';
const router = express.Router();

router.post('/create',upload.array('images', 3), userAuth, createProduct );
router.post('/updateProduct/:productId',userAuth, updateProduct);
router.get('/getAll', getAll );
router.get('/getById/:productId', getById );
router.delete('/deleteById/:productId', deleteById );
router.post('/cart/:productId', userAuth, cart );
router.get('/getcart', userAuth, cartItems );
router.delete('/deletecart/:cartId', userAuth, deleteCart );
router.get('/filterProduct', filterProduct );

export default router;
