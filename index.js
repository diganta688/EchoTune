if(process.env.NODE_ENV!= "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
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
const model = require("./models/popular_artistssss.js");
const model2 = require("./models/popular_albummmm.js");
const data = require("./init/popular_artists.js");
const data2 = require("./init/popular_albums.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.set('views',path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


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
app.get("/add/dummy/data", async(req, res)=>{
    try {
        await model.deleteMany({});
        await model.insertMany(data.data);
        await model2.deleteMany({});
        await model2.insertMany(data2.data2);
        res.send("data1 & 2 save done")
      } catch (err) {
        console.error("Error saving data:", err);
      }
})
app.all("*", (req, res, next) =>{
    next(new expresserr(404, "page not found"));
});
app.use((err, req, res, next)=>{
    let{status=500, message="Something went wrong"} = err;
    res.status(status).render("err.ejs", {message});
    
});
app.listen(process.env.PORT || 3000, () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connected");
    })
    .catch((error) => {
      console.error(`DB connection error: ${error}`);
    });
});