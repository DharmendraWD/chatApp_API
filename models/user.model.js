const mongoose = require("mongoose");   

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    dob: String,
    sex: String,
    address: String,
    mobnumber: Number,
    website: String,
    profession:String,
    hobby: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);