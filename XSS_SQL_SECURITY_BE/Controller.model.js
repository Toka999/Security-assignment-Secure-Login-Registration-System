const{sql,pools}=require("./db.js");
//users
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


//products

// 1. Get Product Details for the Frontend Card (No Image URL fetched)
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        let pool = await pools;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT id, name, price, stock FROM products WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Preview Promo Code (For display only, no DB changes)
exports.applyPromoCode = async (req, res) => {
    try {
        const { productId, promoCode } = req.body;
        let pool = await pools;

        const productResult = await pool.request()
            .input('pId', sql.Int, productId)
            .query('SELECT price, promoCode, promoDiscountPct, isPromoUsed FROM products WHERE id = @pId');

        if (productResult.recordset.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        const product = productResult.recordset[0];

    
        if (product.promoCode !== promoCode || product.isPromoUsed === true) {
            return res.status(400).json({ message: "Invalid, expired, or already used promo code." });
        }

      
        const discountAmount = (product.price * product.promoDiscountPct) / 100;
        const newPrice = product.price - discountAmount;

      
        res.status(200).json({
            newPrice: newPrice,
            discount: product.promoDiscountPct
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Secure Checkout (Solves Race Condition with Row Locking)
exports.checkoutProduct = async (req, res) => {
    let pool = await pools;
    const transaction = new sql.Transaction(pool);

    try {
        const { productId, promoCode } = req.body;
        await transaction.begin();

        const productRequest = new sql.Request(transaction);
        const result = await productRequest
            .input('pId', sql.Int, productId)
            .query(`SELECT id, price, stock, promoCode, promoDiscountPct, isPromoUsed 
                    FROM products WITH (UPDLOCK, HOLDLOCK) 
                    WHERE id = @pId`);

        const product = result.recordset[0];

        if (!product || product.stock <= 0) {
            await transaction.rollback();
            return res.status(400).json({ message: "Product unavailable or out of stock." });
        }

        let finalPrice = product.price;

        if (promoCode && promoCode.trim() !== "") {
            if (product.promoCode !== promoCode || product.isPromoUsed === true) {
                await transaction.rollback();
                return res.status(400).json({ message: "Promo code is invalid or already used." });
            }

            const discountAmount = (product.price * product.promoDiscountPct) / 100;
            finalPrice = product.price - discountAmount;

            // تحديث حالة الكود لـ True (مستخدم) في الداتا بيز
            const burnPromoRequest = new sql.Request(transaction);
            await burnPromoRequest
                .input('pId', sql.Int, productId)
                .query('UPDATE products SET isPromoUsed = 1 WHERE id = @pId');
        }

        const updateStockRequest = new sql.Request(transaction);
        await updateStockRequest
            .input('pId', sql.Int, productId)
            .query('UPDATE products SET stock = stock - 1 WHERE id = @pId');

        await transaction.commit();
        res.status(200).json({ message: "Success!" });

    } catch (err) {
        if (transaction._begun) await transaction.rollback();
        res.status(500).json({ message: err.message });
    }
};