const vendorController = require('../controller/vendorController')
const express= require('express')
const router = express.Router()
router.post('/register',vendorController.vendorRegister)
router.post('/login',vendorController.vendorLogin)
router.get('/get-allVendors',vendorController.getAllVendor)
router.get('/single-vendor/:vendorId', vendorController.getVendorById)
module.exports=router