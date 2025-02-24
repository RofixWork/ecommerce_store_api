import { Schema, Model, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: [true, "Please provide a title"],
      maxlength: [100, "Title must be less than 100 characters long"],
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Schema.Types.Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    comment: {
      type: Schema.Types.String,
      maxlength: [255, "Comment must be less than 255 characters long"],
      trim: true,
      lowercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//eahc user can add one review for each product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: {
          $avg: "$rating",
        },
        numOfReviews: {
          $sum: 1,
        },
      },
    },
  ]);
  
  try {
    await this.model('Product').findByIdAndUpdate(productId, {
        averageRating: Math.ceil(result?.[0]?.averageRating || 0),
        numOfReviews: result?.[0]?.numOfReviews || 0,
    })
  } catch (error) {
    console.error(`Error updating average rating for product ${productId}:`, error);
  }
  
};

ReviewSchema.post("save", async function (next) {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await this.constructor.calculateAverageRating(this.product);
  }
);

/**
 * @type {Model}
 */
const Review = model("Review", ReviewSchema);

export default Review;
