const express = require("express");
const expressSession = require("express-session")
const passport = require("passport");
const app = express();
const bcrypt = require("bcrypt");
const indexRouter = require("./router/index");
const adminRouter = require("./router/admin");
const userRouter = require("./router/user")
const multer = require("multer")
const connectionToDb = require("./confrigation/mongooseconnection");

app.use(expressSession({
    secret: process.env.SECRETE_KEY, // A secret key for signing the session ID cookie
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport and use it with sessions
const cookieParser = require("cookie-parser");
require('dotenv').config()
connectionToDb();
app.use(cookieParser())
require("./confrigation/passport");
app.set("view engine","ejs");
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/",indexRouter);
app.use("/admin",adminRouter);
app.use("/users",userRouter)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
});
