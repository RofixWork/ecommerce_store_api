import {model, Model, Schema} from 'mongoose';

const CartItemSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: [true, "please provide item name"],
        maxlength: [100, "maximum 100 characters allowed"],
        trim: true
    },
    image: {
        type: Schema.Types.String,
        required: [true, "please provide item image"],
        maxlength: [255, "maximum 255 characters allowed"],
        trim: true
    },
    price: {
        type: Schema.Types.Number,
        required: [true, "please provide item price"],
        min: 0
    },
    quantity: {
        type: Schema.Types.Number,
        required: [true, "please provide item amount"],
        min: 1
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
})

const OrderSchema = new Schema({
    tax: {
        type: Schema.Types.Number,
        required: [true, "please provide tax"],
        min: 0
    },
    shippingFee: {
        type: Schema.Types.Number,
        required: [true, "please provide shipping fee"],
        min: 0
    },
    subtotal:{
        type: Schema.Types.Number,
        required: [true, "please provide subtotal"],
        min: 0
    },
    total: {
        type: Schema.Types.Number,
        required: [true, "please provide total"],
        min: 0
    },
    cartItems: {
        type: [CartItemSchema],
    },
    status: { 
        type: Schema.Types.String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'cancelled'],
        default: 'pending'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    },
    paymentIntentId: {
        type: String,
    }
},
{
    timestamps: true
})

/**
 * @type {Model}
 */
const Order = model('Order', OrderSchema);


export default Order;