const User = require("../models/userModel.js")
const {
    APIError,
    HttpStatusCode
} = require("../exception/errorHandler.js")
var mongoose = require('mongoose');

const userDetailsService = async (userId) => {
    try {
        userId = new mongoose.Types.ObjectId(userId);
        const pipeline = [{
            $match: {
                _id: userId
            }
        }]
        let userArray = await User.aggregate(pipeline);
        if (userArray.length == 0) {
            return new APIError("NOT FOUND", HttpStatusCode.NOT_FOUND, true, 'This user id not exist.')
        }

        let userData = userArray[0];


        return userData.name

    } catch (error) {
        return new APIError(error.name, error.httpCode, error.isOperational, error.message);
    }

}

module.exports = {
    userDetailsService
}