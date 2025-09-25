import pool from "../config/db.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from "../config/nodeMailer.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_KEY);


export const createOrder = async (req, res) =>{
    const {userId, quantity} = req.body
    const {productId} = req.params
    try{
        const sql_product = `
            SELECT * FROM products WHERE id = $1 LIMIT 1;
        `
        const sql_Address = `
            SELECT * FROM user_details WHERE user_id = $1 LIMIT 1;
        `
        const sql_user = `
            SELECT * FROM users WHERE id = $1 LIMIT 1;
        `
        const user = await pool.query(sql_user, [userId])
        const User = user.rows[0]
        const userDetail = await pool.query(sql_Address, [userId])
        const userAdressId = userDetail.rows[0]
        const result = await pool.query(sql_product, [productId])
        const product = result.rows[0]
        const Seller = await pool.query(sql_user, [product.seller_id])
        const seller = Seller.rows[0]
        const total_price = quantity * product.price;
        const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total_price * 100),
                currency: 'usd',
            });
        const sql_query = `
            INSERT INTO orders (buyer_id, product_id, quantity, total_price, shipping_address_id)
            VALUES ($1, $2, $3, $4, $5)
        `
        await pool.query(sql_query, [userId, productId, quantity, total_price , userAdressId.id])
        const mailOption = {
        from: process.env.EMAIL,
        to: User.email,
        subject: "Order Confirmation - SIMBA Shop",
        html: `
            <div style="font-family: 'Arial', sans-serif; background-color: #1e2a1f; color: #fff; padding: 20px; border-radius: 8px;">
                <div style="text-align: center;">
                    <h1 style="color: #28a745;"> Order Confirmed! </h1>
                    <p style="font-size: 16px; color: #aaa;">Thank you for shopping with SIMBA Shop.</p>
                </div>
                <div style="background-color: #2e3d2b; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p style="font-size: 18px; color: #fff;">Your order has been successfully placed. Here are the details:</p>
                    <table style="width: 100%; margin-top: 10px; color: #fff;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Product:</td>
                            <td style="padding: 8px;">${product.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Total Paid:</td>
                            <td style="padding: 8px;">${total_price}$</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Shipping Address:</td>
                            <td style="padding: 8px;">
                                ${userAdressId.street}, ${userAdressId.city}, ${userAdressId.country}
                            </td>
                        </tr>
                    </table>
                </div>
                <p style="text-align: center; color: #777; margin-top: 30px;">If you have any questions, feel free to <a href="mailto:support@simbashop.com" style="color: #28a745;">contact us</a>.</p>
                <p style="text-align: center; font-size: 14px; color: #444;">&copy; 2025 SIMBA Shop - All Rights Reserved</p>
            </div>
        `
        };
        await transporter.sendMail(mailOption);
        const Sellermail = {
        from: process.env.EMAIL,
        to: seller.email,
        subject: "New Order Placed - SIMBA Shop",
        html: `
            <div style="font-family: 'Arial', sans-serif; background-color: #1e2a1f; color: #fff; padding: 20px; border-radius: 8px;">
                <div style="text-align: center;">
                    <h1 style="color: #28a745;">New Order Alert! </h1>
                    <p style="font-size: 16px; color: #aaa;">${User.name} has placed an order.</p>
                </div>
                <div style="background-color: #2e3d2b; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p style="font-size: 18px; color: #fff;">Order Details:</p>
                    <table style="width: 100%; margin-top: 10px; color: #fff;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Seller:</td>
                            <td style="padding: 8px;">${seller.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Buyer:</td>
                            <td style="padding: 8px;">${User.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Product:</td>
                            <td style="padding: 8px;">${product.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Total Paid:</td>
                            <td style="padding: 8px;">${total_price}$</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Shipping Address:</td>
                            <td style="padding: 8px;">
                                ${userAdressId.street}, ${userAdressId.city}, ${userAdressId.country}
                            </td>
                        </tr>
                    </table>
                </div>
                <p style="text-align: center; color: #777; margin-top: 30px;">Please prepare the order for shipment.</p>
            </div>
        `
        };
        await transporter.sendMail(Sellermail);
        res.json({success: true, message: 'Order placed successfully'})

    }catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const UpdateOrder = async (req,res) => {
    const {userId, status} = req.body
    const {orderId} = req.params
    try{
        const sql_order = `
            SELECT * FROM orders WHERE id = $1 LIMIT 1;
        `
        const order = await pool.query(sql_order, [orderId])
        const Order = order.rows[0]
        const sql_product = `
            SELECT * FROM products WHERE id = $1 LIMIT 1;
        `
        const product = await pool.query(sql_product, [Order.product_id])
        const Product = product.rows[0]
        if( Product.seller_id !== userId){
            return res.json({success: false, message: "Sorry you are not Authorized"})     
        }
        const sql_query = `
            UPDATE orders 
            SET status = $1
            WHERE id = $2;
        `
        await pool.query(sql_query, [status, orderId])
        res.json({success: true, message: 'Order Updated successfully'})

    } catch(error){
        return res.json({success: false, message: error.message})     
    }
}
export const watchList = async (req, res) =>{
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