const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utlis/config')


mongoose.connect(config.mongodb_url).then(()=>{
    console.log("MongoDB Connected Successfully!!!")
    app.listen(config.port, ()=>{
        console.log(`Server is running on port: ${config.port}`)
    })
}).catch((err)=>{
    console.log("MongoDB Connection Failed", err)
})