const Product= require('../models/Product')
const Firm= require('../models/Firm')
const multer= require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
   const upload = multer({ storage: storage });
const addProduct= async(req,res)=>{
    try {
        const {productName,price,category,bestseller,description} = req.body
        const image = req.file ? req.file.filename : undefined;
        const firmId= req.params.firmId
        const firm = await Firm.findById(firmId)
        if(!firm){
          return res.status(404).json({message: "Firm not found"})
        }
        const product = new Product({
          productName,price,category,bestseller,description,image,firm:firm._id
        })
        const productSaved = await product.save()
        firm.products.push(productSaved)
        await firm.save()
        return res.status(201).json({msg:"products saved sucessfully"})
        
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal error" });
    }
}
const getProduct= async(req,res)=>{
  try {
    const firmId= req.params.firmId
    const firm = await Firm.findById(firmId)
    if(!firm){
      return res.status(404).json({message: "Firm not found"})
    }

    const product = await Product.find({firm:firmId})
    const resturantName = firm.firmName
    return res.status(200).json({resturantName,product})
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg:"internal serever error"})
  }
}
const fs = require('fs') // Import the File System module

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    const firmId= product.firm[0]
    const firm = await Firm.findOneAndUpdate(
      { _id: firmId },
      { $pull: { products: productId } },
      { new: true }
    )
    // Check if the product has an associated image
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', product.image)

      // Delete the image file from the uploads folder
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err)
        }
      })
    }

    return res.status(200).json({ msg: "Product deleted successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Internal server error" })
  }
}
module.exports={addProduct:[upload.single('image'),addProduct],getProduct,deleteProduct}