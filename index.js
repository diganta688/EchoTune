if(process.env.NODE_ENV!= "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const expresserr = require("./extra/expresserror.js");
const userroute = require("./routes/user.js");
const adminroute = require("./routes/admin.js");
const User = require("./models/User.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.set('views',path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

main()
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/music',  { useNewUrlParser: true, useUnifiedTopology: true });
};
const sessionoption = {
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+ 1 * 24 * 60 * 60 * 1000,
        maxAge: 1 * 24 * 60 * 60 * 1000
    }
};
app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next();
});
app.get("/",(req, res)=>{
    res.redirect("/user/music");
});
app.use("/user", userroute);
app.use("/admin", adminroute);
app.all("*", (req, res, next) =>{
    next(new expresserr(404, "page not found"));
});
app.use((err, req, res, next)=>{
    let{status=500, message="Something went wrong"} = err;
    res.status(status).render("err.ejs", {err});
    
});
app.listen(port, ()=>{
    console.log("app is listning at port "+port);
});