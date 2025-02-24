import { Model, model, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, "please provide product name"],
      minlength: [8, "minimum 8 characters required..."],
      maxlength: [100, "maximum 100 characters allowed"],
      trim: true,
      lowercase: true,
    },
    description: {
      type: Schema.Types.String,
      required: [true, "please provide product description"],
      minlength: [20, "minimum 20 characters required..."],
      trim: true,
      lowercase: true,
    },
    price: {
      type: Schema.Types.Number,
      default: 0,
    },
    image: {
      type: Schema.Types.String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: Schema.Types.String,
      required: [true, "please provide product category"],
      enum: [
        "electronics",
        "clothing",
        "accessories",
        "home",
        "health",
        "beauty",
        "office",
        "kitchen",
        "outdoor",
        "sports",
        "travel",
        "gifts",
        "toys",
        "books",
        "stationery",
        "pet",
        "bedroom",
      ],
    },
    company: {
      type: Schema.Types.String,
      enum: {
        values: ["marcos", "ikea", "liddy"],
        message: "{VALUE} is not supported",
      },
      required: [true, 'please provide product company name'],
    },
    featured: {
      type: Schema.Types.Boolean,
      default: false,
    },
    colors: {
      type: [Schema.Types.String],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freeShipping: {
      type: Schema.Types.Boolean,
      default: false,
    },
    inventory: {
      type: Schema.Types.Number,
      min: 0,
      default: 15
    },
    averageRating: {
      type: Schema.Types.Number,
      default: 0,
    },
    numOfReviews: {
      type: Schema.Types.Number,
      default: 0,
    }
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
);

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: "_id",
  foreignField: 'product',
  justOne: false,
  // match: {rating: {$lte: 3}}
});

ProductSchema.pre('deleteOne', {query:false, document: true}, async function(next) {
  await this.model('Review').deleteMany({product: this._id});
  next();
})

/**
 * @type {Model} Product
 */
const Product = model("Product", ProductSchema);

export default Product;
