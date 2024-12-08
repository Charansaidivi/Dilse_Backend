const express = require('express')
const dotEnv= require('dotenv')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const VenderRoutes= require('./routes/VendorRoutes')
const firmRoutes= require('./routes/FirmRoutes')
const productRouters= require('./routes/ProductRoutes')
const bodyParser=require('body-parser')
const app= express()
const PORT =5000
dotEnv.config()

mongoose.connect(process.env.Mongoose_key)
.then(()=>{
    console.log("connected to database")
})
.catch(()=>{
    console.log("not connected to database")
})
app.use(bodyParser.json())
app.use('/vendor',VenderRoutes)
app.use('/firm',firmRoutes)
app.use('/product',productRouters)
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
app.use('/home',(req,res)=>{
    res.send("<h1>welcome to home page</h1>")
})