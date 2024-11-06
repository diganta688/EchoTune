const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const adminschema = new Schema({
    email:{
        type: String,
        required: true
    }
});

adminschema.plugin(passportLocalMongoose);

let Admin = mongoose.model("Admin", adminschema);

module.exports = Admin;
