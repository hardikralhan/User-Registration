const jwt = require("jsonwebtoken")
var mongoose = require('mongoose');
const STATUS = require("../constants/status.js")
const ERRORCODE = require("../constants/errorcode.js")

const auth = async (req, res, next) => {
    try {
        // const token = req.headers['x-auth-token'];
        const token = req.headers['authorization']
        if (!token) {
            return res.status(STATUS.UNAUTHORIZED).send(`{"errorCode":"USREG0006", "error":"${ERRORCODE.USREG0006}"}`);
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (new Date().getTime() > verify.tokenExpiryTime) {
            return res.status(STATUS.UNAUTHORIZED).send(`{"errorCode":"USREG0007", "error":"${ERRORCODE.USREG0007}"}`);
        }
        const userId = new mongoose.Types.ObjectId(verify.userId);
        req.body.userId = userId
        next();
    } catch (error) {
        next(error)
    }
}

module.exports = {auth}