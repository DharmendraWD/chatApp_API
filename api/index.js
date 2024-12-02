const express = require("express");
const app = express();
const connectDB = require("../config/db");
const userRouter = require("../routes/user.routes");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// User registration API
app.use("/api/users", userRouter);

// Root route
app.get("/", (req, res) => {
    res.send("Hello World");
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})
// Export the express app as a serverless function (Vercel-specific)
module.exports = (req, res) => {
    app(req, res);
};
