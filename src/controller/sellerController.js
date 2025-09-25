import pool from "../config/db.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from "../config/nodeMailer.js";


export const seeProducts = async (req,res) =>{
    const {userId} = req.body
    try{
        const sql_query = `
            SELECT * FROM products WHERE seller_id = $1;
        `
        const result = await pool.query(sql_query, [userId])
        const products = result.rows[0]
        res.json({success: true, products: products, message: 'Request successfull'})
    } catch(error){
        return res.json({success: false, message: error.message})     
    }
}