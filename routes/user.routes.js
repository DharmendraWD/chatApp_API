const auth = require("../middlewares/auth.js");
const express = require("express");
const router = express.Router();
const user = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const admin = require('../firebase.js');
const Admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

const db = Admin.firestore();

router.get('/', auth, async (req, res) => {
    // getting logged in user id 
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await admin.firestore().collection('users').doc(decoded.userId).get();
    let loggedInUserId = decoded.userId


    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();  // Get all documents in 'users' collection

    if (snapshot.empty) {
        console.log('No users found.');
        return;
    }

    const users = [];
    snapshot.forEach(doc => {
        const userData = doc.data();  // Get data for each document
        userData.id = doc.id;         // Optionally include the document ID
        users.push(userData);
    });





    return res.render("homepage", { users,loggedInUserId });
})

router.get("/register", async (req, res) => {
    return res.render("register")
});
router.get("/login", async (req, res) => {
    return res.render("login")
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
//logout| FIREBASE
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
});

// register | FIREBASE

router.post('/register', async (req, res) => {
    const { fname, lname, email, password, sex, dob } = req.body;

    bcrypt.hash(password, saltRounds, async function (err, hash) {
        try {
            // Interact with Firestore
            const userRef = admin.firestore().collection('users').doc();

            await userRef.set({
                fname: fname,
                lname: lname,
                email: email,
                password: hash,
            });

            // res.status(201).json({ message: 'User registered successfully' });
            return res.redirect('/login');
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

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

    res.render("myprofile", { user: user })
})

// individual user's profile 
router.get('/profile/:id', async (req, res) => {

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
        res.render('myprofile', { user, loggedInUserId, userId });
    } catch (error) {
        res.status(500).send('Error fetching user details from Firestore');
    }
});
module.exports = router;