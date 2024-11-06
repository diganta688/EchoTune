const mongoose = require('mongoose');   
const model = require("../models/popular_artistssss.js");
const model2 = require("../models/popular_albummmm.js");
const data = require("./popular_artists.js");
const data2 = require("./popular_albums.js");
const data3 = require("./songs.js");

main()
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/music');
};

let add_DB = async ()=>{
    await model.deleteMany({});
    await model.insertMany(data.data);
    console.log("data saved done");
}
let add_DB2 = async ()=>{
    await model2.deleteMany({});
    await model2.insertMany(data2.data2);
    console.log("data2 saved done");
}


add_DB();
add_DB2();
// modul