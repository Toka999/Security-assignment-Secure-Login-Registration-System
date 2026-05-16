const express=require("express");
const app=express();
const cors =require("cors");

const helmet=require("helmet");
require("dotenv").config();
app.use(cors( ));
app.use(express.json());
app.use(helmet());

const router=require("./Route.model");



app.use('/auth',router);




app.listen(process.env.PORT,()=>{
console.log(`Listening to port ${process.env.PORT}`)
});