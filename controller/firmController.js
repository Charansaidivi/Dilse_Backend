const Vendor=require('../models/Vendor')
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

   const addFirm = async (req, res) => {
    try {
      const { firmName, area, category, region, offers } = req.body;
      const image = req.file ? req.file.filename : undefined;
  
      // Fetch the vendor by ID
      const vendor = await Vendor.findById(req.vendorId);
      if (!vendor) {
        return res.status(404).json({ msg: "Vendor not found" });
      }
  
      // Create a new firm document
      const firm = new Firm({
        firmName,
        area,
        category,
        region,
        offers,
        image,
        vendor: vendor._id,
      });
  
      // Save the firm document
      const savedFirm = await firm.save();
  
      // Push the firm into the vendor's firms array
      vendor.firms.push(savedFirm); // Access the specific vendor's 'firms' property
      await vendor.save();
  
      return res.status(200).json({ msg: "Firm created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal error" });
    }
  };
  const firmDelete = async(req,res)=>{
    try {
      const firmId= req.params.firmId
      const firm = await Firm.findByIdAndDelete(firmId)
      if(!firm){
        return res.status(404).json({message: "firm not found"})
      }
      return res.status(200).json({msg:"firm deleted sucessfully"})
    } catch (error) {
      console.log(error)
      return res.status(500).json({msg:"internal serever error"})
    }
  }
module.exports={addFirm:[upload.single('image'),addFirm],firmDelete}