const{sql,pools}=require("./db.js");

exports.loginUser=async(req,res)=>{
    try{
        const {username,userpass}=req.body;
        let pool=await pools
        const result=await pool.request()
        .input('user',sql.NVarChar,username)
        .input('pass',sql.NVarChar,userpass)
        .query(` SELECT * FROM users WHERE username=@user AND userpassword=@pass `);

        if(result.recordset.length>0){return res.status(200).json({Message:"Login Sucessfully"})}
        else{return res.status(401).json({Message:"Invalid Username or Password "})};
    }catch(err){res.status(500).json({Message:err.Message, stack:err.stack})};
}

exports.registerUser=async (req,res)=>{
    try{
        const {username, useremail, userpass}=req.body;
        let pool=await pools;

        const check=await pool.request()
        .input('email',sql.NVarChar,useremail)
        .query(` SELECT * FROM users WHERE useremail=@email `);
        if(check.recordset.length>0){
            return res.status(400).json({Message:"User alredy registerd!"})
        }
        
        await pool.request()
        .input('user',sql.NVarChar,username)
        .input('email',sql.NVarChar,useremail)
        .input('pass',sql.NVarChar,userpass)
        .query('INSERT INTO users (username,useremail ,userpassword) VALUES (@user,@email, @pass)');
        res.status(201).json({Message:"User Registered"})
    }catch(err){res.status(500).json({Message:err.Message, stack:err.stack})};

}