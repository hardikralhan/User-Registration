const mongoose  = require("mongoose");

const TokenSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    token: String,
    expiresAt: Number
}, { timestamps: true });

const Token = mongoose.model('tokens', TokenSchema)

module.exports = Token