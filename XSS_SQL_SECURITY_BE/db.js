const mssql=require("mssql");
require("dotenv").config()
const sql=require("mssql");
const config={
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB,
    server:process.env.SERVER,
    pool:{
        max:10,
        min:0,
        idleTimeoutMillis:3000
    },
    options:{
        encrypt:false,
        trustServerCertificate:true
    },
    port:1433

}


const pools=sql.connect(config);
const show=async()=>{
    const pool=await pools;
    if (pool.connected){console.log("DB Connected")}
}
show();
module.exports={sql,pools}