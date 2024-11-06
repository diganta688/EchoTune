const mongoose = require('mongoose');
const playlists = require("./playlist.js");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    playlists:[
        {
            type: Schema.Types.ObjectId,
            ref: "Playlist"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model("User", userSchema);

module.exports = User;
