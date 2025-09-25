import express from 'express';
import {upload} from '../config/cloudinary.js'
import userAuth from '../middleware/authMiddleware.js';
import { createProduct, deleteById, getAll, getById, updateProduct } from '../controller/productController.js';
const router = express.Router();

router.post('/create',upload.array('images', 3), userAuth, createProduct );
router.post('/updateProduct/:productId',userAuth, updateProduct);
router.get('/getAll', getAll );
router.get('/getById/:productId', getById );
router.delete('/deleteById/:productId', deleteById );

export default router;
