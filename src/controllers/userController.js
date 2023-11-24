const {
    userDetailsService
} = require('../services/userService')
const STATUS = require("../constants/status.js")
const ERRORCODE = require("../constants/errorcode.js")

const userDetailsController = async (req, res, next) => {
    try {
        let id = req.params.id

        const result = await userDetailsService(id);

        if (result.httpCode == 404) {
            return res.status(STATUS.NOT_FOUND).send(`{"errorCode":"USREG0008", "error":"${ERRORCODE.USREG0008}"}`);
        }
        if (result.httpCode == 500) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"USREG0000", "error":"${ERRORCODE.USREG0000}"}`);
        }
        return res.status(200).send(result)

    } catch (error) {
        next(error)
    }
}

module.exports = {
    userDetailsController
}