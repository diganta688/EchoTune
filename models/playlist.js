const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Songs = require("../models/songsplaylist")

const playlistSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    songs:[
        {
            type: Schema.Types.ObjectId,
            ref: "Playlistsong"
        }
    ]
});
playlistSchema.post("findOneAndDelete", async(ar)=>{
    if(ar){
        await Songs.deleteMany({_id: {$in: ar.songs}});
    }
});

let Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;