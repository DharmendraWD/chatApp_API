const express = require("express");
const router = express.Router();
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const admin = require('../firebase.js');
const Admin = require('firebase-admin');

const db = Admin.firestore();

router.get("/test", (req, res) => {
    res.send("Test route");
});

// user registration api | LOCAL
// router.post("/register", async (req, res) => {
//     const { name, email, password, sex } = req.body;

//     bcrypt.hash(password, saltRounds, async function (err, hash) {
//         const newUser = await user.create({ name, email, password: hash, sex });
//         res.status(200).json({ newUser });
//     });

// });

// getAlluser | LOCAL
// router.get("/register", async (req, res) => {
//     const allUser = await user.find();
//     res.status(200).json({ allUser });
// });

// LOGIN API | LOCAL 
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const userFound = await user.findOne({ email });
//     if (userFound) {
//         bcrypt.compare(password, userFound.password, function (err, result) {
//             if (result) {
//                 res.status(200).json({ userFound });
//             } else {
//                 res.status(400).json({ message: "Invalid credentials" });
//             }
//         });
//     } else {
//         res.status(400).json({ message: "User not found" });
//     }
// }); 


// FIREBASE    FIREBASE    FIREBASE    FIREBASE    FIREBASE    FIREBASE    FIREBASE    FIREBASE
// user registration api | FIREBASE
router.post('/register', async (req, res) => {
    const { name, email, password, sex } = req.body;

        bcrypt.hash(password, saltRounds, async function (err, hash) {
            try {
                // Interact with Firestore
                const userRef = admin.firestore().collection('users').doc();

                await userRef.set({
                    name: name,
                    email: email,
                    password: hash,
                    sex: sex
                });

                res.status(201).json({ message: 'User registered successfully' });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    // try {
    //     // Interact with Firestore
    //     const userRef = admin.firestore().collection('users').doc();

    //     await userRef.set({
    //         name: name,
    //         email: email,
    //         password: password
    //     });

    //     res.status(201).json({ message: 'User registered successfully' });
    // } catch (error) {
    //     console.error('Error:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }
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

// login api | FIREBASE
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
                res.status(200).json({ message: 'Login successful', userId: userDoc.id });
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



module.exports = router;