const Joi=require("joi");
const bcrypt = require("bcrypt");
const users=Joi.object({
    username:Joi.string().required().pattern(/^[a-zA-z0-9]/).messages({
        "string.pattern.base": "Username can only contain letters, numbers, and spaces. No symbols allowed!",
        "string.empty": "Username is required"
    }),
    useremail:Joi.string().trim().email() .required()
        .messages({
            "string.email": "Please enter a valid email address"
        }),
    userpass:Joi.string().required().pattern(/^[a-zA-z0-9]/).messages({
        "string.pattern.base": "Password can only contain letters, numbers, and spaces. No symbols allowed!",
        "string.empty": "Password is required"
    })
        
});

const validateRegister=async (req,res,next)=>{
    const {value, error}=users.validate(req.body,{stripUnknown:true});
    if(error){return res.status(400).json({Message:error.details[0].message})}
    const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(value.userpass, saltRounds);
        value.userpass = hashedPassword;

    req.body=value;
    next();
}



const usersLogin=Joi.object({
    username:Joi.string().required().pattern(/^[a-zA-z0-9]/).messages({
        "string.pattern.base": "Username can only contain letters, numbers, and spaces. No symbols allowed!",
        "string.empty": "Username is required"
    }),

    userpass:Joi.string().required().pattern(/^[a-zA-z0-9]/).messages({
        "string.pattern.base": "Password can only contain letters, numbers, and spaces. No symbols allowed!",
        "string.empty": "Password is required"
    })
        
});
const ValidateLogin=(req,res,next)=>{
    const {value, error}=usersLogin.validate(req.body,{stripUnknown:true});
    if(error){return res.status(400).json({Message:error.details[0].message})}
    req.body=value;
    next();
}

module.exports={
    validateRegister,
    ValidateLogin
};