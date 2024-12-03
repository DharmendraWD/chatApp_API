const express = require("express");
const app = express();
const connectDB = require("../config/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');
const userRouter = require("../routes/api.routes");
const EJSuserRoutes = require("../routes/user.routes");


connectDB();
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// User registration API
app.use("/api/users", userRouter);
app.use("/", EJSuserRoutes);





app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})
// Export the express app as a serverless function (Vercel-specific)
module.exports = (req, res) => {
    app(req, res);
};
