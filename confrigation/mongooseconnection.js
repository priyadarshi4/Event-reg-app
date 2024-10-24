const mongoose = require("mongoose");

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
    console.log("connected to database")
    }
    catch(err){
        console.error("connection error",err)
        process.exit(1);
    }
}

module.exports= connectDb;