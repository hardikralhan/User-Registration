const {
    comparePassword,
    encryptPassword
} = require("../helpers/passwordEncryption/passwordEncryption.js")
var mongoose = require('mongoose');
const User = require("../models/userModel.js")
const jwt = require("jsonwebtoken")
const Token = require("../models/tokenModel.js")
const {
    APIError,
    HttpStatusCode
} = require("../exception/errorHandler.js")


const userLoginService = async (userId, password) => {
    try {

        //#region User Pipeline
        let userPipeline = [{
                $project: {
                    email: {
                        $toLower: '$email'
                    },
                    status: '$status',
                    password: '$password',
                    name: '$name'
                }
            },
            {
                $match: {
                    email: userId
                }
            }
        ]
        //#endregion

        let result = await User.aggregate(userPipeline)

        let userDetails = result[0]

        let hashedPassword = userDetails.password

        let isPasswordMatched = await comparePassword(password, hashedPassword)

        // to be deleted once registration is done
        // isPasswordMatched = true;
        if (isPasswordMatched) {

            // getting Token of User
            let tokenObj = await getTokenOfUserService(userDetails._id)

            if (tokenObj == null || new Date().getTime() > tokenObj.expiresAt) {
                await generateTokenService(userDetails._id)
                // getting Token of User
                tokenObj = await getTokenOfUserService(userDetails._id)
            }
            return {
                token: tokenObj.token,
                expiresAt: tokenObj.expiresAt,
                userName: userDetails.name
            }
        } else {
            // Return Error Message Because Password Does Not Matched
            return new APIError("BAD_INPUT", HttpStatusCode.BAD_INPUT, true, 'Wrong Password.')
        }

    } catch (error) {
        console.log(error);
        throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
    }
}

const generateTokenService = async (userId) => {
    try {

        //generate new token
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let generatedTime = new Date().getTime()
        let tokenExpiryTime = generatedTime + 24 * 60 * 60 * 1000 // Token Expires In 1 Day

        let data = {
            userId: userId,
            tokenExpiryTime: tokenExpiryTime
        }

        const token = jwt.sign(data, jwtSecretKey);

        // Deleting Previous Token
        await Token.findOneAndDelete({
            userId: userId
        })

        // Creating Token Object To Store In DB
        let tokenObject = {
            userId: userId,
            token: token,
            expiresAt: tokenExpiryTime
        }
        let tokenData = await Token.create(tokenObject)
        await tokenData.save()

        // Resolve Promise
        return Promise.resolve()
    } catch (error) {
        console.log(error);
        throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
    }
}

//#region Get Token Of User
const getTokenOfUserService = async (userId) => {
    try {

        //#region Token Pipeline
        let tokenPipeline = [{
            $match: {
                userId: userId
            }
        }]
        //#endregion

        let res = await Token.aggregate(tokenPipeline)
        if (res.length > 0) {
            return res[0]
        } else {
            return null
        }

    } catch (error) {
        console.log(error);
        throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
    }
}

const userSignUpService = async (name, email, password) => {
    try {

        // Hashing Password
        password = await encryptPassword(password)

        let userObject = {
            name: name,
            email: email,
            password: password,
            status: 1, // active
        }

        let user = await User.create(userObject)
        await user.save();
        return;
    } catch (error) {
        console.log(error);
        throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
    }
}

module.exports = {
    userLoginService,
    generateTokenService,
    getTokenOfUserService,
    userSignUpService,
}