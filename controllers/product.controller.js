import { StatusCodes } from 'http-status-codes';
import Product from '../models/Product.js';
import {NotFound, BadRequest} from '../errors/index.js';
import path from 'path';
import {mkdir, access} from 'fs/promises'
import Review from '../models/Review.js';
/**
 * @typedef {import('express').Request} RequestType
 * @typedef {import('express').Response} ResponseType
 */
class ProductController {
    /**
     * Description
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
    static async all(request, response) {
        const products = await Product.find().populate('reviews')
        return response.send({nbHits:products.length, products})
    }

    /**
     * Description
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
    static async get(request, response) {
        const {id} = request.params;
        const product = await Product.findById(id).populate('reviews');
        if (!product) {
            throw new NotFound('Product not found')
        }
        return response.status(StatusCodes.OK).json({product})
    }

    /**
     * Description
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
    static async create(request, response) {
        const {id: userId} = request.user;
    
        const product = await Product.create({...request.body, user: userId})
        return response.status(StatusCodes.OK).json({product})
    }

    /**
     * Description
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
    static async uploadImage(request, response) {

        if(!request.files) {
            throw new BadRequest('No image uploaded')
        }

        const productImage = request.files.image;
        const folderPath = path.resolve('public', 'uploads')
        const filePath = path.resolve(folderPath, productImage.name);
        
        //check file type
        if(!productImage.mimetype.startsWith('image')) {
            throw new BadRequest('Invalid file type. Only images are allowed')
        }
        //max szie
        const maxSize = 1024 * 1024;
        if(productImage.size > maxSize) {
            throw new BadRequest('Image size is too big. Maximum size is 1MB')
        }

        //check if folder exists
       try {
        await access(folderPath);
       } catch (error) {
        await mkdir(folderPath, {
            recursive: true,
        })
       }

        await productImage.mv(filePath)
        
        
        return response.status(StatusCodes.OK).json({image: `/uploads/${productImage.name}`})
    }

    /**
     * Description
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
    static async update(request, response) {
        const {id: productId} = request.params;
        const {id: userId} = request.user;
        const product = await Product.findOneAndUpdate({_id: productId}, {...request.body, user: userId}, {new: true, runValidators:true})

        if (!product) {
            throw new NotFound('Product not found or you are not the owner')
        }

        return response.status(StatusCodes.OK).json({product});
    }


    /**
     * Description
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
    static async delete(request, response) {
        const {id: productId} = request.params;
        /**
         * @type {import('mongoose').Document}
         */
        const product = await Product.findOne({_id: productId});

        if (!product) {
            throw new NotFound('Product not found or you are not the owner')
        }
        await product.deleteOne();
        return response.status(StatusCodes.OK).json({
            msg: 'Product deleted successfully'
        })
    }

    /**
     * Description
     * @param {RequestType} request
     * @param {ResponseType} response
     * @returns {ResponseType}
     */
    static async product_reviews(request, response) {
        const {id: productId} = request.params;
        const reviews = await Review.find({product: productId});
        return response.status(StatusCodes.OK).json({nbHits: reviews.length, reviews});
    }
}

export default ProductController;