const mongoose  = require("mongoose");

// Users Schema Starts From Here
const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    dropDups: true
  },
  status: Number,   // 0 -Sleep 1- Active 2-Blocked
  password: String,
}, { timestamps: true });

const User = mongoose.model('users', UserSchema)

module.exports = User;