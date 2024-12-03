const express = require("express");
const app = express();
const connectDB = require("../config/db");
const userRouter = require("../routes/user.routes");
require("dotenv").config();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const auth = require("../middlewares/auth");


connectDB();
app.use(cookieParser());
// User registration API
app.use("/api/users", userRouter);

// Root route
app.get("/", auth, (req, res) => {
    res.send("Hello World");
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})
// Export the express app as a serverless function (Vercel-specific)
module.exports = (req, res) => {
    app(req, res);
};
