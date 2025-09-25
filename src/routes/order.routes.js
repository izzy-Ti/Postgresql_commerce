import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import { createOrder, orderHistory, UpdateOrder } from '../controller/orderController.js';
const router = express.Router();

router.post('/createOrder/:productId',userAuth, createOrder );
router.post('/UpdateOrder/:orderId',userAuth, UpdateOrder );
router.get('/orderHistory',userAuth, orderHistory );

export default router;
