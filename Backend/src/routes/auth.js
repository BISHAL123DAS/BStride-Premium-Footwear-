
const { Router } = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require("../middleware/authMiddleware");

const authRouter = Router();

// // / @route POST /api/auth/register
// // @description register a new user
// // @access public
authRouter.post('/register', authController.registerUserController);

// // / @route POST /api/auth/Login
// // @Login for existing user
// // @access public
authRouter.post('/login', authController.loginUserController);



// // @route POST /api/auth/logout
// // @description logout the user
// // @access public
authRouter.post('/logout', authController.logOutControler);


// /**
//  * @route GET /api/auth/get-me
//  * @description get the current logged in user details
//  * @access private
//  */
authRouter.get('/get-Profile', authMiddleware.authUser, authController.getMeController);

module.exports = authRouter;  