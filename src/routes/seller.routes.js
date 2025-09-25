import express from 'express';
import {upload} from '../config/cloudinary.js'
import userAuth from '../middleware/authMiddleware.js';
import { addReview, productRating, productReviews } from '../controller/reviewController.js';
import { seeProducts } from '../controller/sellerController.js';
const router = express.Router();

router.get('/seeProducts', userAuth, seeProducts );

export default router;
