const Product= require('../models/Product')
const Firm= require('../models/Firm')
const multer= require('multer')

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
const deleteProduct= async(req,res)=>{
  try {
    productId= req.params.productId
    const product = await Product.findByIdAndDelete(productId)
    if(!product){
      return res.status(404).json({message: "Product not found"})
    }
    return res.status(200).json({msg:"product deleted sucessfully"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"internal serever error"})
  }
}
module.exports={addProduct:[upload.single('image'),addProduct],getProduct,deleteProduct}