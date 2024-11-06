const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Songs = require("./songs");

const artistsSchema = new Schema({
    image:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    songs:[
        {
            type: Schema.Types.ObjectId,
            ref: "Songs"
        }
    ]
});

artistsSchema.post("findOneAndDelete", async(ar)=>{
    if(ar){
        await Songs.deleteMany({_id: {$in: ar.songs}});
    }
});


let Artists = mongoose.model("Artists", artistsSchema);

module.exports = Artists;