import mongoose from 'mongoose';
import app  from './app'
import config  from './utlis/config'


mongoose.connect(config.mongodb_url).then(()=>{
    console.log("MongoDB Connected Successfully!!!")
    app.listen(config.port, ()=>{
        console.log(`Server is running on port: ${config.port}`)
    })
}).catch((err:Error)=>{
    console.log("MongoDB Connection Failed", err)
})