// const express = require('express');

// // const app=express();

// // app.use(express.json());

// const app=require("./src/app");
// const concetedToDB = require("./src/config/database");

// concetedToDB();

// // app.get('/',(req,res)=>{
// //     res.send('Hello World');
// // });


// app.listen(5001,()=>{
//     console.log('Server is running on port 5000');
// });



const app = require("./src/app");
const connectToDB = require("./src/config/database");

require('dotenv').config();

// Connect to DB immediately
connectToDB();

module.exports = app;