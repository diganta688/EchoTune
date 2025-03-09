require("dotenv").config();
const mongoose = require("mongoose");
const model = require("../models/popular_artistssss.js");
const model2 = require("../models/popular_albummmm.js");
const data = require("./popular_artists.js");
const data2 = require("./popular_albums.js");

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URL;
    if (!mongoURI) {
      console.error("MongoDB connection string is not defined in environment variables.");
      process.exit(1);
    }
  
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("DB connected");
    } catch (error) {
      console.error(`DB connection error: ${error}`);
      process.exit(1);
    }
  };
  
  let add_DB = async () => {
    try {
      await model.deleteMany({});
      await model.insertMany(data.data);
      console.log("data saved done");
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };
  
  let add_DB2 = async () => {
    try {
      await model2.deleteMany({});
      await model2.insertMany(data2.data2);
      console.log("data2 saved done");
    } catch (err) {
      console.error("Error saving data2:", err);
    }
  };
  
  const run = async () => {
    await connectDB();
    await add_DB();
    await add_DB2();
    mongoose.connection.close();
  };
  
  run();