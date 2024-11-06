const express = require("express");
const router = express.Router({mergeParams: true});
// const SongAlbum = require("../models/songsss_album.js");
// const SongArtist = require('../models/songsss_artist.js');
const popular_artists = require("../models/popular_artistssss.js");
const popular_album = require("../models/popular_albummmm.js");
const wrapasync = require("../extra/wrapasync.js");
const {saveRedirectUrl} = require("../middleware.js");


router.get("/:artistId/:songIndex/artist", wrapasync, async(req, res)=>{

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
        res.render("admin/admin-player-artist.ejs", {
            song: currentSong, 
            artistId, 
            songs, 
            nextIndex, 
            prevIndex,
            artist,
        });
    }
});
router.get("/:albumId/:songIndex/album", wrapasync, async(req, res)=>{

    const { albumId, songIndex } = req.params;
    const album = await popular_album.findById(albumId).populate('songs');
    const songs = album.songs;
    const index = parseInt(songIndex);
    const currentSong = songs[index];
    // console.log(req.session.redirectUrl);
    const nextIndex = (index + 1) % songs.length;
    const prevIndex = (index - 1 + songs.length) % songs.length;
    if(!songs){
        req.flash("error", "something went wrong");
        res.redirect("/admin/songs/admin");
    }else{
        res.render("play/player-album.ejs", {
            song: currentSong, 
            albumId, 
            songs, 
            nextIndex, 
            prevIndex,
            album,
        });
    }
});

router.get("/back", saveRedirectUrl, (req, res)=>{
    let redirecturl = res.locals.redirectUrl;
    const previousUrl = req.get('Referer') || '/';
    console.log(req.originalUrl);
    
    res.redirect(redirecturl);
})

module.exports = router;