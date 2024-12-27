const express = require('express')
const dotEnv= require('dotenv')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const VenderRoutes= require('./routes/VendorRoutes')
const firmRoutes= require('./routes/FirmRoutes')
const productRouters= require('./routes/ProductRoutes')
const bodyParser=require('body-parser')
const path = require('path')
const cors= require('cors')
const app= express()

const PORT = process.env.PORT || 5000
dotEnv.config()
app.use(cors())
mongoose.connect(process.env.Mongoose_key)
.then(()=>{
    console.log("connected to database")
})
.catch((error)=>{
    console.log("not connected to database",error)
})
app.use(bodyParser.json())
app.use('/vendor',VenderRoutes)
app.use('/firm',firmRoutes)
app.use('/product',productRouters)
app.use('/uploads',express.static('uploads'))
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
              