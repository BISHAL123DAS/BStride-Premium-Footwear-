const  mongoose=require('mongoose');
async function concectionDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to the database");

    }catch(err){
        console.log("Error connecting to the database",err);
    }
}

module.exports=concectionDB;