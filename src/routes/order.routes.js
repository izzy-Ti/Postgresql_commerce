import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import { createOrder, UpdateOrder } from '../controller/orderController.js';
const router = express.Router();

router.post('/createOrder/:productId',userAuth, createOrder );
router.post('/UpdateOrder/:orderId',userAuth, UpdateOrder );

export default router;
