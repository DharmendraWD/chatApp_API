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
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
// console.log(email, password)
//     try {
//         // Step 1: Check if the user exists in Firestore by email
//         const userRef = db.collection('users').doc(email);
//         const userDoc = await userRef.get();

//         if (!userDoc.exists) {
//             return res.status(400).json({ message: "User not found in the database" });
//         }

//         const hash = userDoc.data().password;

//         // Step 2: Compare the provided password to the stored hash
//         bcrypt.compare(password, hash, function (err, result) {
//             if (!result) {
//                 return res.status(401).json({ message: "Invalid password" });
//             }

//             // Step 3: If the password is correct, proceed to authenticate with Firebase Authentication
//             admin.auth()
//                 .signInWithEmailAndPassword(email, password)
//                 .then((userCredential) => {
//                     const user = userCredential.user;

//                     // Return user info if login is successful
//                     res.status(200).json({
//                         uid: user.uid,
//                         email: user.email
//                     });
//                 })
//                 .catch((error) => {
//                     // Handle authentication errors (wrong password, etc.)
//                     const errorCode = error.code;
//                     const errorMessage = error.message;

//                     res.status(400).json({
//                         message: errorMessage,
//                         code: errorCode
//                     });
//                 });

//         });

//     } catch (err) {
//         console.error("Error during login:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });




module.exports = router;