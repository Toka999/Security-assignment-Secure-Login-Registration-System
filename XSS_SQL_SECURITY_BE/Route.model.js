const express=require("express");
const router=express.Router();
const Authcontroller=require("./Controller.model.js");

router.post("/login",Authcontroller.loginUser);
router.post("/register",Authcontroller.registerUser);

module.exports=router;