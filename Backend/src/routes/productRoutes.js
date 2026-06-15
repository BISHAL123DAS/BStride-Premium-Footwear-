const { Router } = require('express');
const productController = require('../controllers/productController');
const { authUser, isAdmin } = require('../middleware/authMiddleware');

const productRouter = Router();

// Public routes — anyone can view



productRouter.get('/',     productController.getAllProductsController);

// /**
//  * @route GET /api/products/:id
//  * @description Get single product
//  * @access Public
//  */
productRouter.get('/:id',  productController.getSingleProductController);

// Protected routes — only admin can create, update, delete


// /**
//  * @route POST /api/products
//  * @description Create a new product
//  * @access Private
//  */
productRouter.post('/',       authUser, isAdmin, productController.createProductController);

// /**
//  * @route GET /api/products
//  * @description Get all products
//  * @access Public
//  */
productRouter.put('/:id',     authUser, isAdmin, productController.updateProductController);

// /**
//  * @route DELETE /api/products/:id
//  * @description Delete product
//  * @access Private
//  */
productRouter.delete('/:id',  authUser, isAdmin, productController.deleteProductController);

module.exports = productRouter;