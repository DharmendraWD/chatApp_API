const auth =  require("../middlewares/auth.js");

const express = require("express");
const router = express.Router();
const user = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const admin = require('../firebase.js');
const Admin = require('firebase-admin');
const jwt = require('jsonwebtoken');


router.get('/',  auth, (req, res) => {
   return res.render("homepage")
})

router.get("/register", async (req, res) => {
   return res.render("register")
});
router.get("/login", async (req, res) => {
 return  res.render("login")
});

// login \ firebase 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the email exists in Firestore
        const userSnapshot = await admin.firestore().collection('users').where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(400).json({ error: 'Email not found' });
        }

        // Assuming email is unique, we can get the first document
        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data();

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (result) {
                // Password matches, login success
                    
                const token = jwt.sign({
                    userId: userDoc.id,
                    email: userDoc.email,
                    username: userDoc.username
                },
                    process.env.JWT_SECRET,)

                res.cookie('token', token);
                return res.redirect('/');
            } else {
                // Password doesn't match
                res.status(400).json({ error: 'Invalid password' });
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// get all registered users api | FIREBASE
router.get("/register", async (req, res) => {
    try {
        // Fetch users from the Firestore 'users' collection
        const usersSnapshot = await db.collection('users').get();

        // Format the data
        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Return the users as a JSON response
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


// my profile 
router.get('/my-profile', auth, async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userDoc = await admin.firestore().collection('users').doc(decoded.userId).get();
    const user = userDoc.data();

    console.log(user)
    res.render("myprofile", { user: user })
})
module.exports = router;