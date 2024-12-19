const express = require("express");
const app = express();
const connectDB = require("../config/db"); // Assuming you have this to connect to the database
require("dotenv").config(); // For environment variables
const cookieParser = require("cookie-parser");
const path = require("path");

const userRouter = require("../routes/api.routes"); // Routes for user registration
const EJSuserRoutes = require("../routes/user.routes"); // Routes for user-related actions (login, register)
const profileRoutes = require("../routes/profile.routes"); // Routes for the user's profile
const messageRoutes = require("../routes/messages.routes")
const methodOverride = require('method-override');
// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); // Ensure the correct path to the views folder
app.use(methodOverride('_method'));
// Global middleware to check if user is logged in
app.use((req, res, next) => {
    const token = req.cookies.token;

    // Check if the token exists and assign the appropriate value to res.locals.isLoggedIn
    res.locals.isLoggedIn = token ? true : false;  // If token exists, the user is logged in

    next(); // Pass to the next middleware or route handler
});
// Routes
app.use("/api/users", userRouter); // User-related API routes
app.use("/", EJSuserRoutes); // Routes for handling login, register, etc.
app.use("/profile", profileRoutes); // Profile routes
app.use("/message", messageRoutes)



// Homepage route (renders nav.ejs)
app.get("/", (req, res) => {
    res.render("index"); // Render the homepage with the navigation bar
});

// Example logout route
app.get("/logout", (req, res) => {
    res.clearCookie("isLoggedIn"); // Clear the login cookie
    res.clearCookie("username"); // Clear the username cookie
    res.redirect("/"); // Redirect to homepage after logout
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

// Export the express app as a serverless function (optional, for Vercel deployment)
module.exports = (req, res) => {
    app(req, res);
};
