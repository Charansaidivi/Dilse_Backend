const bcrypt = require('bcryptjs');
const Vendor = require('../models/Vendor');
const jwt=require('jsonwebtoken')
const dotEnv=require('dotenv')
dotEnv.config()
const secretKey=process.env.MyName


const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if username exists
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ msg: 'Vendor already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new vendor
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword,
        });

        await newVendor.save();
        return res.status(201).json({ msg: 'Vendor registered successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Error in registration',
            type: error.name,
            location: 'bcrypt.hash',
            error: error.message,
        });
    }
};
const vendorLogin =async(req,res)=>{
    const {email,password}=req.body;
    try{
        const vendor=await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(400).json({msg:'Invalid credentials'});
        }
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({msg:"Login sucess",token})
        console.log(email)
    }
    catch(error){
        console.error(error)
        return res.status(500).json({msg:"Internal server Error"})
    }
}
const getAllVendor=async(req,res)=>{
    try {
        const vendorData= await Vendor.find().populate('firms')
        return res.status(200).json(vendorData)
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg:"Internal server Error"})
    }
}

module.exports = { vendorRegister,vendorLogin,getAllVendor };
