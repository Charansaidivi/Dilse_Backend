const express = require('express')
const productController = require('../controller/productController')
const router = express.Router()
router.post('/add-product/:firmId',productController.addProduct)
router.get('/:firmId/products',productController.getProduct)
router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName
    res.headersSent('Content-Type','image/jpeg')
    res.sendFile(path.join(__dirname,'..','uploads',imageName))
})
router.delete('/:productId',productController.deleteProduct)
module.exports=router