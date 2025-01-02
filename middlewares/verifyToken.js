const Vendor=require('../models/Vendor')
const jwt= require('jsonwebtoken')
const dotEnv=require('dotenv')
dotEnv.config()
const secretKey=process.env.MyName
const verifyToken = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
      return res.status(401).json({ msg: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      const vendor = await Vendor.findById(decoded.vendorId);
      if (!vendor) {
        return res.status(401).json({ msg: 'Vendor not found.' });
      }
      req.vendorId = vendor._id;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Invalid token.' });
    }
  };
  
  module.exports = verifyToken;
  