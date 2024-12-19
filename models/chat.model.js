


const mongoose = require("mongoose")
const User = require("./user.model")


// Define the schema for the Message model
const messageSchema = new mongoose.Schema({
    senderID: { type: mongoose.Schema.Types.ObjectId,
    }, 
    receiverID: { type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
    }, 
    message: { type: String

     },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Create and export the Message model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;