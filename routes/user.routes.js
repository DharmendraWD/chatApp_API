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



router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userFound = await user.findOne({ email });
    if (userFound) {
        bcrypt.compare(password, userFound.password, function (err, result) {
            if (result) {
                res.status(200).json({ userFound });
            } else {
                res.status(400).json({ message: "Invalid credentials" });
            }
        });
    } else {
        res.status(400).json({ message: "User not found" });
    }
}); 

module.exports = router;