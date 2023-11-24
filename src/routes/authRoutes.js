const express = require("express");
const {userLoginController, userSignupController} = require('../controllers/authController.js');
// import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/login',userLoginController)
router.post('/signup',userSignupController)

module.exports = router;