const express = require("express");
const app = express();
const connectDB = require("./config/db");
const userRouter = require("./routes/user.routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();

connectDB();

// user registration api 
app.use("/api/users", userRouter);  




module.exports = (req, res) => {
    app(req, res);
};



app.listen(process.env.PORT, () => console.log("Server running on port 3000"));