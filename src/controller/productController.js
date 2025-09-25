import pool from "../config/db.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from "../config/nodeMailer.js";

export const createProduct = async (req, res) =>{
    const {userId, name, description, price, stock, category } = req.body
    const images = req.files.map(f => f.path);
    try{
        if(!name || !description || !price || !stock || !category || !images) {
            return res.json({success: false, message: "Missing details"})     
        }
        const sql_query = `
            INSERT INTO products (seller_id, name,  description, price, stock, category , images)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `
        await pool.query(sql_query, [userId, name, description, price, stock, category, images])
        res.json({success: true, message: 'Product saved successfully'})
    }catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const updateProduct = async (req,res) =>{
    const {userId, name, description, price, stock, category } = req.body
    const {productId} = req.params
    try{
        if(!name || !description || !price || !stock || !category) {
            return res.json({success: false, message: "Missing details"})     
        }
        const sql_find = `
            SELECT * FROM products WHERE id = $1 LIMIT 1;
        `
        const result =await pool.query(sql_find, [productId])
        const product = result.rows[0]
        if(!product.seller_id == userId){
            return res.json({success: false, message: "Sorry you are not Authorized"})     
        }
        const sql_query = `
            UPDATE products
            SET name = $1,
                description = $2,
                price = $3,
                stock = $4,
                category = $5,
                updated_at = $6

            WHERE id = $7
        `
        await pool.query(sql_query, [name, description, price, stock, category, new Date(), productId])
        res.json({success: true, message: 'Product updated successfully'})
    }catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const getAll = async (req,res) =>{
    try{
        const sql_query = `
            SELECT * FROM products
        `
        const products =await pool.query(sql_query)
        res.json({success: true, products: products.rows, message: 'Request successfull'})
    }catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const getById = async (req,res) =>{
    const {productId} = req.params
    try{
        const sql_query = `
            SELECT * FROM products WHERE id = $1 LIMIT 1;
        `
        const product = await pool.query(sql_query, [productId])
        res.json({success: true, product: product.rows[0], message: 'Request successfull'})
    }catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const deleteById = async (req, res) =>{
    const {productId} = req.params
    try{
        const sql_query = `
            DELETE FROM products WHERE id = $1 RETURNING *;
        `
        const product = await pool.query(sql_query, [productId])
        res.json({success: true, product: product.rows[0], message: 'Request successfull'})
    }catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const cart = async (req, res) =>{
    const {userId} = req.body
    const {productId} = req.params
    try{
        const sql_query = `
            INSERT INTO user_wishlist (user_id, product_id)
            VALUES ($1, $2)
        `
        await pool.query(sql_query, [userId, productId])
        res.json({success: true, message: 'Cart added successfully'})

    } catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const cartItems = async (req, res) =>{
    const {userId} = req.body
    try{
        const sql_cart = `
            SELECT * FROM user_wishlist WHERE user_id = $1;
        `
        const cart = await pool.query(sql_cart, [userId])
        res.json({success: true, cart: cart.rows, message: 'Request successfull'})
    } catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const deleteCart = async (req,res) => {
    const {cartId} = req.params
    const {userId} = req.body
    try{
        const sql_cart = `
            SELECT * FROM user_wishlist WHERE id = $1;
        `
        const cart = await pool.query(sql_cart, [cartId])
        const Cart = cart.rows[0]
        if(Cart.user_id !== userId){
            return res.json({success: false, message: "Sorry you are not authorized"})     
        }
        const sql_query = `
            DELETE FROM user_wishlist WHERE id = $1;
        `
        await pool.query(sql_query, [cartId])
        res.json({success: true, message: 'Request successfull'})
    } catch(error){
        return res.json({success: false, message: error.message})     
    }
}