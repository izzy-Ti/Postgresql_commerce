import pool from "../config/db.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from "../config/nodeMailer.js";


export const addReview = async (req, res) =>{
    const {userId, rating, comment} = req.body
    const {productId} = req.params
    try{
        const sql_order_check = `
            SELECT * FROM orders WHERE buyer_id = $1 AND product_id = $2
        `
        const isOrdered = await pool.query(sql_order_check, [userId, productId])
        const sql_submitted = `
            SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2; 
        `
        const isReviewed = await pool.query(sql_submitted, [userId, productId])
        if(isOrdered.rows.length < 1){
            return res.json({success: false, message: 'Sorry you have not ordered this item'})     
        }
        if(isReviewed.rows.length > 1 ){
            return res.json({success: false, message: 'Product is already reviewed'})     
        }
        const sql_query = `
             INSERT INTO reviews (product_id, user_id, rating, comment)
             VALUES ($1, $2, $3, $4)
        `
        await pool.query(sql_query, [productId, userId, rating, comment])
        res.json({success: true, message: 'Review submitted successfully '})
    } catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const productRating = async (req,res) =>{
    const {productId} =req.params
    try{
        const sql_query = `
            SELECT p.*, AVG(r.rating) AS average_rating
            FROM products p
            LEFT JOIN reviews r ON p.id = r.product_id
            WHERE p.id = $1
            GROUP BY p.id;
        `
        const rate = await pool.query(sql_query, [productId])
        const Rate = rate.rows[0].average_rating
        res.json({success: true, Rate: Rate, message: 'Review submitted successfully successfull'})
    } catch(error){
        return res.json({success: false, message: error.message})     
    }
}