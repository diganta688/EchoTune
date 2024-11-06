const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Songs = require("./songs");


const albumSchema = new Schema({
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

albumSchema.post("findOneAndDelete", async(ar)=>{
    if(ar){
        await Songs.deleteMany({_id: {$in: ar.songs}});
    }
});


let Albums = mongoose.model("Albums", albumSchema);

module.exports = Albums;