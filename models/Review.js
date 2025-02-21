import {Schema, Model, model} from 'mongoose';


const ReviewSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: [true, 'Please provide a title'],
        maxlength: [100, 'Title must be less than 100 characters long'],
        trim: true,
        lowercase: true,
    },
    rating: {
        type: Schema.Types.Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
    },
    comment: {
        type: Schema.Types.String,
        maxlength: [255, 'Comment must be less than 255 characters long'],
        trim: true,
        lowercase: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }
}, {
    timestamps: true,
});
//eahc user can add one review for each product
ReviewSchema.index({product: 1, user: 1}, {unique: true})

/**
 * @type {Model}
 */
const Review = model("Review", ReviewSchema);

export default Review;