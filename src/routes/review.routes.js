import express from 'express';
import {upload} from '../config/cloudinary.js'
import userAuth from '../middleware/authMiddleware.js';
import { addReview, productRating } from '../controller/reviewController.js';
const router = express.Router();

router.post('/addReview/:productId', userAuth, addReview );
router.get('/productRating/:productId', userAuth, productRating );



export default router;
