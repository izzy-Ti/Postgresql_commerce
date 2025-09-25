import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import { createProduct, deleteById, getAll, getById, updateProduct } from '../controller/productController.js';
const router = express.Router();

router.post('/create',userAuth, createProduct );
router.post('/updateProduct/:productId',userAuth, updateProduct);
router.get('/getAll', getAll );
router.get('/getById/:productId', getById );
router.delete('/deleteById/:productId', deleteById );

export default router;
