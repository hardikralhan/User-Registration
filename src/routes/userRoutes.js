const express = require("express");
const {userDetailsController} = require('../controllers/userController.js');
const { auth } = require('../middlewares/auth.js') 

const router = express.Router()

router.post('/:id',[auth],userDetailsController)


module.exports = router;