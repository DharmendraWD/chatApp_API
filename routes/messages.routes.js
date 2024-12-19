

const router = require("express").Router();
const auth = require("../middlewares/auth.js");
const user = require("../models/user.model.js");
const admin = require('../firebase.js');
const Admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = Admin.firestore();

router.get("/:id", auth, async (req, res) => {

    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await admin.firestore().collection('users').doc(decoded.userId).get();
    // const loggedInUser = userDoc.data();
    let loggedInUserId = decoded.userId


    const userId = req.params.id;
    try {
        const userDoc = await db.collection('users').doc(userId).get();  // Fetch user by ID from Firestore

        if (!userDoc.exists) {
            res.status(404).send('User not found');
            return;
        }

        const user = userDoc.data();
        return res.render("message", {user})
    } catch (error) {
        res.status(500).send('Error fetching user details from Firestore');
    }


}); 












module.exports = router;