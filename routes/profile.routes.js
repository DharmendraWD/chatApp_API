const router = require("express").Router();
const auth = require("../middlewares/auth.js");
const user = require("../models/user.model.js");
const admin = require('../firebase.js');
const Admin = require('firebase-admin');
const jwt = require('jsonwebtoken');


const db = Admin.firestore();

router.get("/edit", auth, async (req, res) => {
    // const user = req.user;
return res.render("editInfo");
    // res.render("profile", { user });
}); 


router.put("/edit", async (req, res) => {
    console.log(req.body); // Log request body to check the data

    try {
        const newUserData = req.body;

        // Validate the new data from the request body
        if (!newUserData || Object.keys(newUserData).length === 0) {
            return res.status(400).json({ error: 'No data provided to update' });
        }

        const usersSnapshot = await db.collection('users').get();

        if (usersSnapshot.empty) {
            return res.status(404).json({ error: 'No users found' });
        }

        // Update each user's data
        const updatePromises = usersSnapshot.docs.map(doc => {
            return db.collection('users').doc(doc.id).update(newUserData);
        });

        await Promise.all(updatePromises);

        res.status(200).json({ message: 'All user data updated successfully' });
    } catch (error) {
        console.error('Error updating users:', error);
        res.status(500).json({ error: 'Failed to update data' });
    }
});


module.exports = router;