const express=require("express");
const router=express.Router();
const Authcontroller=require("./Controller.model.js");
const { 
    getProductById, 
    applyPromoCode, 
    checkoutProduct 
} = require('./Controller.model.js');
const {
    validateRegister,
    ValidateLogin
   
}=require("./Validation.middleware.js");

router.post("/login",ValidateLogin,Authcontroller.loginUser);
router.post("/register",validateRegister,Authcontroller.registerUser);
router.get('/product/:id', getProductById);
router.post('/apply-promo', applyPromoCode);
router.post('/checkout', checkoutProduct);

module.exports=router;