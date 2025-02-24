import { StatusCodes } from 'http-status-codes';
import Order from '../models/Order.js';
import {BadRequest, NotFound} from '../errors/index.js';
import Product from '../models/Product.js';
/**
 * @typedef {import('express').Request} RequestType
 * @typedef {import('express').Response} ResponseType
 */
class OrderController {
    /**
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
    static async all(request, response) {
        const {id: userId} = request.user;
        const orders = await Order.find({user: userId});
        return response.status(StatusCodes.OK).json({nbHits: orders.length, orders})
    }

    /**
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
    static async get(request, response) {
        const {id: userId} = request.user;
        const {id: orderId} = request.params;
        const order = await Order.findOne({
            _id: orderId,
            user: userId
        })
        if (!order) {
            throw new NotFound("Order not found");
        }
        return response.status(StatusCodes.OK).json({order})
    }

     /**
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
     static async get_user_orders(request, response) {
        const {id: userId} = request.user;
        const orders = await Order.find({
            user: userId
        })

        return response.status(StatusCodes.OK).json({nbHits: orders.length, orders})
    }

     /**
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
     static async create(request, response) {
        const {items, tax, shippingFee} = request.body;
        if(!items || !items.length) {
            throw new BadRequest('Cart items are required')
        }
        if(!tax || !shippingFee) {
            throw new BadRequest('Tax and shipping fee are required')
        }

        let cartItems = [],
        subtotal = 0;
        for (const item of items) {
            const product = await Product.findById(item?.product);

            if(!product) {
                throw new BadRequest('Invalid product id')
            }

            cartItems = [...cartItems, item]
            subtotal += product.price * item.quantity;
            
        }
        //calc total
        const total = subtotal + tax + shippingFee;
        const paymentIntentId = await OrderController.fakeStripeAPI({amount: total, currency:"usd"});
        
        const order = await Order.create({
            tax,
            shippingFee,
            subtotal,
            total,
            cartItems,
            clientSecret: paymentIntentId.secret,
            user: request.user.id
        })
        return response.status(StatusCodes.CREATED).json({order});
    }

     /**
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
     static async update(request, response) {
        const {id: userId} = request.user;
        const {id: orderId} = request.params;
        const {paymentIntentId} = request.body;
        const order = await Order.findOne({
            _id: orderId,
            user: userId
        })
        if (!order) {
            throw new NotFound("Order not found");
        }
        order.status = 'paid';
        order.paymentIntentId = paymentIntentId;
        await order.save();
        return response.status(StatusCodes.OK).json({order})
    }

    static async fakeStripeAPI({amount, currency}) {
        // Simulate a payment with Stripe API
        return {
            secret: '1234567890',
            status:'succeeded',
            amount,
            currency
        }
    }
}

export default OrderController;