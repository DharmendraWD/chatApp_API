const express = require("express");
const router = express.Router();
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const admin = require('../firebase.js');




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



// getAlluser 
router.get("/register", async (req, res) => {
    const allUser = await user.find();
    res.status(200).json({ allUser });
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