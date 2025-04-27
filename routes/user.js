const express = require("express");
const router = express.Router({mergeParams: true});
const popular_artists = require("../models/popular_artistssss.js");
const popular_album = require("../models/popular_albummmm.js");
const User = require('../models/User.js');
const Playlist = require('../models/playlist.js');
const wrapasync = require("../extra/wrapasync.js");
const passport = require("passport");
const multer = require('multer');
const Songs = require("../models/songs.js");
const PlaylistSong = require("../models/songsplaylist.js");

const {saveRedirectUrl, isuserLoggeddIn} = require("../middleware.js");


const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });

router.get("/", (rew, res)=>{
    res.redirect("/user/music");
});

router.get("/music", isuserLoggeddIn, wrapasync(async(req, res)=>{
    let allArtists = await popular_artists.find({});
    let allalbums = await popular_album.find({});
    let id = req.user.id;
    const user = await User.findById(id).populate('playlists');    
    res.render("user/homepage.ejs", {allArtists, allalbums, username: user.username, user});
}));


//!user artist
router.get("/artist/:id", isuserLoggeddIn, wrapasync(async(req, res)=>{
    let {id} = req.params;
    let artist = await popular_artists.findById(id).populate("songs");
    let uid = req.user.id;
    const user = await User.findById(uid).populate('playlists');    
    res.render("user/artist-allsongs.ejs", {artist, user, username: user.username});
}));


//!user album
router.get("/album/:id", isuserLoggeddIn, wrapasync(async(req, res)=>{
    let{id} = req.params;
    let album = await popular_album.findById(id).populate("songs");
    let uid = req.user.id;
    const user = await User.findById(uid).populate('playlists');    
    res.render("user/album-allsongs.ejs", {album, user});
}));


//!user playlist
router.post("/add/playlist/:id", isuserLoggeddIn,  wrapasync(async(req, res)=>{
    // let{name} = req.body;
    let{id} = req.params;
    let user = await User.findById(id);

    const newplaylist = new Playlist({
        name:req.body.name
    })

    user.playlists.push(newplaylist);
    await newplaylist.save();
    await user.save();
    res.redirect("/user/music");
}));

//!playlist
router.get("/playlist/:id", isuserLoggeddIn, wrapasync(async(req, res)=>{
    let{id} = req.params; 
    let playlist = await Playlist.findById(id).populate('songs');    
    let songs = await Songs.find({});
    res.render("playlist/userPlayList.ejs", {playlist, songs});
}));

//!playlist add song
router.get("/playlist/addsong/:id/:songid", isuserLoggeddIn, upload.single('song'), wrapasync(async(req, res)=>{
    let {id, songid} = req.params;
    let song = await Songs.findById(songid);
    let Playlists = await Playlist.findById(id)
    let addSongPlaylist = new PlaylistSong({
        title: song.title,
        playlist: Playlists,
        audioPath: song.audioPath,
    });
    Playlists.songs.push(addSongPlaylist);
    await addSongPlaylist.save();
    await Playlists.save();
    res.redirect(`/user/playlist/${id}`);
}));

//!playlist delete songs
router.delete("/playlist/:id/:songid", isuserLoggeddIn, wrapasync(async(req, res)=>{
    let{id, songid}= req.params;
    await Playlist.findByIdAndUpdate(id, {$pull: {songs: songid}});
    await PlaylistSong.findByIdAndDelete(songid);
    res.redirect(`/user/playlist/${id}`);
}));

//!delete playlist
router.get("/delete/playlist/:id/:playid", isuserLoggeddIn, wrapasync(async(req, res)=>{
    let{id, playid}= req.params;
    await User.findByIdAndUpdate(id, {$pull: {playlists: playid}});
    await Playlist.findByIdAndDelete(playid);
    res.redirect("/user/music")
}));


//!play
router.get("/play/:artistId/:songIndex/artist", isuserLoggeddIn, wrapasync( async(req, res)=>{
    const { artistId, songIndex } = req.params;
    const artist = await popular_artists.findById(artistId).populate('songs');
    const songs = artist.songs;
    const index = parseInt(songIndex);
    const currentSong = songs[index];

    const nextIndex = (index + 1) % songs.length;
    const prevIndex = (index - 1 + songs.length) % songs.length;
    if(!songs){
        req.flash("error", "something went wrong");
        res.redirect("/user/music");
    }else{
        res.render("play/user-player-artist.ejs", {
            song: currentSong, 
            artistId, 
            songs, 
            nextIndex, 
            prevIndex,
            artist,
        });
    }
}));

router.get("/play/:albumId/:songIndex/album", isuserLoggeddIn, wrapasync(async(req, res)=>{
    const { albumId, songIndex } = req.params;
    const album = await popular_album.findById(albumId).populate('songs');
    const songs = album.songs;
    const index = parseInt(songIndex);
    const currentSong = songs[index];
    const nextIndex = (index + 1) % songs.length;
    const prevIndex = (index - 1 + songs.length) % songs.length;
    if(!songs){
        req.flash("error", "something went wrong");
        res.redirect("/user/music");
    }else{
        res.render("play/user-player-album.ejs", {
            song: currentSong, 
            albumId, 
            songs, 
            nextIndex, 
            prevIndex,
            album,
        });
    }
}));


router.get("/play/:id/:songIndex", isuserLoggeddIn, wrapasync(async(req, res)=>{
    const { id, songIndex } = req.params;
    const playlist = await Playlist.findById(id).populate('songs');
    const songs = playlist.songs;
    const index = parseInt(songIndex);
    const currentSong = songs[index];
    const nextIndex = (index + 1) % songs.length;
    const prevIndex = (index - 1 + songs.length) % songs.length;
    if(!songs){
        req.flash("error", "something went wrong");
        res.redirect("/user/music");
    }else{
        res.render("play/playlistPlayer.ejs", {
            song: currentSong, 
            id, 
            songs, 
            nextIndex, 
            prevIndex,
            playlist,
        });
    }
}));





router.get('/signup', (req, res) => {
    res.render('user/user-signup');
});

router.post("/signup", wrapasync(async(req, res)=>{
    try{
        let{username, email, password} = req.body;
        const newuser = new User({email, username});    
        await User.register(newuser, password);
        req.login(newuser, (err)=>{
            if(err){
                return next(err);
            };
            req.flash("success", "Successfully Signed-up")
            res.redirect("/user/login");

        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/user/signup");
    }
}));

router.get('/login', (req, res) => {
    res.render('user/user-login.ejs');
});

router.post('/login', saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true}), wrapasync(async (req, res) => {
    req.session.id = req.user.id;    
    req.flash("success", "welcome Back");
    let redirecturl = res.locals.redirectUrl || "/user/music";
    res.redirect(redirecturl);
}));

router.get('/logout', (req, res) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "logout successful");
        res.redirect("/user/login");
    });
});

module.exports = router;