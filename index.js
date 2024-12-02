const express = require("express");
const app = express();
const connectDB = require("./config/db");
const userRouter = require("./routes/user.routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// user registration api 
app.use("/api/users", userRouter);  








app.listen(3000, () => console.log("Server running on port 3000"));