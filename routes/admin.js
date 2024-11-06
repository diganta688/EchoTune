const express = require("express");
const router = express.Router({mergeParams: true});
const popular_artists = require("../models/popular_artistssss.js");
const popular_album = require("../models/popular_albummmm.js");
const Songs = require("../models/songs.js");
const User = require('../models/User.js');
const Admin = require('../models/admin.js');
// const Playlist = require("../models/playlist.js");
// const ArtistSong = require('../models/songsss_artist.js');
// const AlbumSong = require('../models/songsss_album.js');
const multer = require('multer');
const path = require('path');
const wrapasync = require("../extra/wrapasync.js");
const {saveRedirectUrl, isadminLoggeddIn} = require("../middleware.js");
const passport = require("passport");


const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });

//!homepage
router.get("/", (req, res)=>{
    res.render("admin/admin-login.ejs")
});

router.get("/songs/admin", isadminLoggeddIn, wrapasync(async(req, res)=>{
    const mainuser = await User.findById(req.user); 
    let users = await User.find({});
    let allArtists = await popular_artists.find({});
    let allalbums = await popular_album.find({});
    let songs = await Songs.find({});
    res.render("admin/admin-homepage.ejs", {allArtists, allalbums, username: mainuser.username, users, songs});
}));




//!allsongs page
router.get("/songs/:id/admin", isadminLoggeddIn, wrapasync(async(req, res)=>{
    const mainuser = await User.findById(req.user);
    let {id} = req.params;
    let artist = await popular_artists.findById(id).populate("songs");
    if(!artist){
        req.flash("error", "something went wrong");
        res.redirect("/admin/songs/admin");
    }else{
        
        res.render("admin/admin-artists-allsongs.ejs", {artist, username: mainuser.username});
    }
}));

router.get("/songs/:id/admin/album", isadminLoggeddIn, wrapasync( async(req, res)=>{
    const mainuser = await User.findById(req.user);
    let {id} = req.params;
    let album = await popular_album.findById(id).populate("songs");
    if(!album){
        req.flash("error", "something went wrong");
        res.redirect("/admin/songs/admin");
    }else{
    res.render("admin/admin-album-allsongs.ejs", {album, username: mainuser.username});
    }
}));



//!addnew song page
router.get("/songs/:id/addnewsong/admin", isadminLoggeddIn, wrapasync(async(req, res)=>{
    let {id} = req.params; 
    let artist = await popular_artists.findById(id);
    res.render("admin/admin-upload", {artist})
}));

router.get("/songs/:id/addnewsong/admin/album", isadminLoggeddIn, wrapasync( async(req, res)=>{
    let {id} = req.params;
    let album = await popular_album.findById(id);
    res.render("admin/admin-upload-album", {album})
}));




//!upload new song
router.post("/songs/:id/addnewsong/admin", isadminLoggeddIn, upload.single('song'), wrapasync(async(req, res)=>{
    let {id}= req.params;
    let artists = await popular_artists.findById(req.params.id);
    const newSong = new Songs({
        title: req.body.title,
        // owner: artists._id,
        audioPath: `/uploads/${req.file.filename}`,
    });    
    artists.songs.push(newSong)
    await newSong.save();
    await artists.save();
    res.redirect(`/admin/songs/${id}/admin`);
}));

router.post("/songs/:id/addnewsong/admin/album", isadminLoggeddIn, upload.single('song'), wrapasync(async(req, res)=>{
    let {id}= req.params;
    let album = await popular_album.findById(req.params.id);
    const newSong = new Songs({
        title: req.body.title,
        // owner: album._id,
        audioPath: `/uploads/${req.file.filename}`,
    });
    album.songs.push(newSong);
    await newSong.save();
    await album.save();
    res.redirect(`/admin/songs/${id}/admin/album`);
}));



//!play song
router.get("/play/:artistId/:songIndex/artist", isadminLoggeddIn, wrapasync( async(req, res)=>{
    const { artistId, songIndex } = req.params;
    const artist = await popular_artists.findById(artistId).populate('songs');
    const songs = artist.songs;
    const index = parseInt(songIndex);
    const currentSong = songs[index];

    const nextIndex = (index + 1) % songs.length;
    const prevIndex = (index - 1 + songs.length) % songs.length;
    if(!songs){
        req.flash("error", "something went wrong");
        res.redirect("/admin/songs/admin");
    }else{
        res.render("play/admin-player-artist.ejs", {
            song: currentSong, 
            artistId, 
            songs, 
            nextIndex, 
            prevIndex,
            artist,
        });
    }
}));

router.get("/play/:albumId/:songIndex/album", isadminLoggeddIn, wrapasync( async(req, res)=>{
    
    const { albumId, songIndex } = req.params;
    const album = await popular_album.findById(albumId).populate('songs');
    const songs = album.songs;
    const index = parseInt(songIndex);
    const currentSong = songs[index];

    const nextIndex = (index + 1) % songs.length;
    const prevIndex = (index - 1 + songs.length) % songs.length;
    if(!songs){
        req.flash("error", "something went wrong");
        res.redirect("/admin/songs/admin");
    }else{
        res.render("play/admin-player-album.ejs", {
            song: currentSong, 
            albumId, 
            songs, 
            nextIndex, 
            prevIndex,
            album,
        });
    }
}));





//!delete song 
router.delete("/songs/:id/song/:songid/admin",isadminLoggeddIn, wrapasync( async(req, res)=>{
    let {id, songid}= req.params;
    // await Playlist.findByIdAndUpdate()
    await popular_artists.findByIdAndUpdate(id, {$pull: {songs: songid}});
    await Songs.findByIdAndDelete(songid);
    res.redirect(`/admin/songs/${id}/admin`);
}));
router.delete("/songs/:id/song/:songid/admin/album", isadminLoggeddIn, wrapasync(async(req, res)=>{
    let {id, songid}= req.params;
    await popular_album.findByIdAndUpdate(id, {$pull: {songs: songid}});
    await Songs.findByIdAndDelete(songid);
    res.redirect(`/admin/songs/${id}/admin/album`);
}));


//!add artist page
router.post("/addartist", isadminLoggeddIn, wrapasync(async(req, res)=>{
    let newartist = new popular_artists({
        image: req.body.image,
        name: req.body.name
    });
    await newartist.save();
    res.redirect("/admin/songs/admin")
}));


//!add album page
router.post("/addalbum",isadminLoggeddIn, wrapasync(async(req, res)=>{
    let newalbum = new popular_album({
        image: req.body.image,
        name: req.body.name
    });
    await newalbum.save();
    res.redirect("/admin/songs/admin")
}));

//!delete artist page
router.delete("/delete/artist/:id",isadminLoggeddIn, wrapasync(async(req, res)=>{
    let {id}= req.params;
    await popular_artists.findByIdAndDelete(id);
    res.redirect("/admin/songs/admin");
}));

//!delete album page
router.delete("/delete/album/:id",isadminLoggeddIn, wrapasync(async(req, res)=>{
    let {id}= req.params;
    await popular_album.findByIdAndDelete(id);
    res.redirect("/admin/songs/admin");
}));

//!login

router.get('/signup', (req, res) => {
    res.render('admin/admin-signup');
});

router.post("/signup", wrapasync(async(req, res)=>{
        try{
            let{username, email, password} = req.body;
            const newadmin = new Admin({email, username});    
            await Admin.register(newadmin, password);
            req.login(newadmin, (err)=>{
                if(err){
                    return next(err);
                };
                req.flash("success", "Successfully Signed-up")
                res.redirect("/admin/login");
    
            })
        } catch(e){
            req.flash("error", e.message);
            res.redirect("/admin/signup");
        }
    }));
// });

router.get('/login', (req, res) => {
    res.render('admin/admin-login');
});

router.post('/login', saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true}), wrapasync(async (req, res) => {
    req.session.id = req.user.id;    
    req.flash("success", "welcome Back");
    let redirecturl = res.locals.redirectUrl || "/admin/songs/admin";
    res.redirect(redirecturl);
}));

router.get('/logout', (req, res) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "logout successful");
        res.redirect("/admin/login");
    });
});


module.exports=router;


