

const router = require("express").Router();
const auth = require("../middlewares/auth.js");
const user = require("../models/user.model.js");
const admin = require('../firebase.js');
const Admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = Admin.firestore();
const chat = require("../models/chat.model.js");

     // message/rr3lnt3tn3 
  
router.get("/:id", auth, async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await admin.firestore().collection('users').doc(decoded.userId).get();
    // const loggedInUser = userDoc.data();
    let loggedInUserId = decoded.userId

// target user id 
    const userId = req.params.id;
    try {
        const userDoc = await db.collection('users').doc(userId).get();  // Fetch user by ID from Firestore

// Fetching the chat messages
const sentChatBlob = await db.collection('chat')
    .where('senderID', '==', loggedInUserId)
    .where('receiverID', '==', userId)
    .get();

const receivedChatBlob = await db.collection('chat')
    .where('senderID', '==', userId)
    .where('receiverID', '==', loggedInUserId)
    .get();

// Map the chats to include the timestamp as a Date object
const sentChat = sentChatBlob.docs.map(doc => ({
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(), // Convert to JavaScript Date
    id: doc.id
}));

const receivedChat = receivedChatBlob.docs.map(doc => ({
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(), // Convert to JavaScript Date
    id: doc.id
}));

// Combine and sort chats
const allChats = [...sentChat, ...receivedChat];
allChats.sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp




        if (!userDoc.exists) {
            res.status(404).send('User not found');
            return;
        }
              
               // user means targeted usser 
        const user = userDoc.data();
        return res.render("message", {user,userId, loggedInUserId, allChats})
    } catch (error) {
        res.status(500).send('Error fetching user details from Firestore');
    }


}); 


   // message/rr3lnt3tn3 
// post send message
router.post("/:id", auth, async (req, res) => {
    const { message } = req.body;
    const senderId = req.user.userId;
    const receiverId = req.params.id;
console.log("LS")
    if (!message) {
        return res.status(400).json({ error: 'Message content is required' });
    }

    try {


        const newMessage = await db.collection('chat').add({
            senderID: senderId,
            receiverID: receiverId,
            message: message,
            timestamp: new Date()
        });

        res.status(201).json({ message: 'Message sent successfully', messageId: newMessage.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});










module.exports = router;