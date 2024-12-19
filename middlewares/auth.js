const jwt = require("jsonwebtoken");
const path = require('path');


function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        // return res.status(401).json({ message: "Unauthorized" });

        if (req.url =="/edit"){
            return res.render("login");
        }
        return res.render('index');
    }


try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
}catch(error){
    // return res.status(401).json({ message: error });
   return res.render("login");
    // res.render("index")
}
}




module.exports = auth;