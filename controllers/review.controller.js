import { StatusCodes } from "http-status-codes";
import Product from "../models/Product.js";
import { NotFound, BadRequest, CustomError } from "../errors/index.js";
import Review from "../models/Review.js";
import { Query } from "mongoose";
/**
 * @typedef {import('express').Request} RequestType
 * @typedef {import('express').Response} ResponseType
 */
class ReviewController {
  /**
   * @param {RequestType} request
   * @param {ResponseType} response
   * @returns {ResponseType}
   */
  static async all(request, response) {
    const reviews = await Review.find({}).populate({path: 'product', select: 'name price company'}).populate({path: 'user', select: '_id name'});

    return response
      .status(StatusCodes.OK)
      .json({ nbHits: reviews.length, reviews });
  }

  /**
   * @param {RequestType} request
   * @param {ResponseType} response
   * @returns {ResponseType}
   */
  static async get(request, response) {
    const { id: reviewId } = request.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new NotFound("Review not found");
    }
    return response.status(StatusCodes.OK).json({ review });
  }

  /**
   * @param {RequestType} request
   * @param {ResponseType} response
   * @returns {ResponseType}
   */
  static async create(request, response) {
    const { product: productId } = request.body;
    const { id: userId } = request.user;

    //check product
    const isValidProduct = await Product.findById(productId);

    if (!isValidProduct) {
      throw new NotFound("Product not found");
    }

    //check if user has already created a review for this product
    const isUserReviewCreated = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (isUserReviewCreated) {
      throw new CustomError(
        "User has already created a review for this product",
        StatusCodes.CONFLICT
      );
    }
    const review = await Review.create({ ...request.body, user: userId });

    return response.status(StatusCodes.CREATED).json({ review });
  }

  /**
   * @param {RequestType} request
   * @param {ResponseType} response
   * @returns {ResponseType}
   */
  static async update(request, response) {
    const { id: reviewId } = request.params;
    const {id: userId} = request.user;
    const {title, comment, rating} = request.body;
    const review = await Review.findOne({
        _id: reviewId,
        user: userId
    })
    if (!review) {
        throw new NotFound("Review not found or you are not the owner");
    }
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.rating = rating || review.rating;
    await review.save();
    return response.status(StatusCodes.OK).json({ review });
  }

  /**
   * @param {RequestType} request
   * @param {ResponseType} response
   * @returns {ResponseType}
   */
  static async delete(request, response) {
    const { id: reviewId } = request.params;
    const {id: userId} = request.user;
    /**
     * @type {Query}
     */
    const review = await Review.findOne({_id: reviewId, user: userId});
    if (!review) {
        throw new NotFound("Review not found or you are not the owner");
    }
    await review.deleteOne();
    return response.status(StatusCodes.OK).json({msg: 'review has been removed successfully...'});
  }
}

export default ReviewController;
