import connectDB from "./db/index.js";
import {app} from "./app.js"


const port = process.env.PORT  || 8000

try{
    await connectDB()
    app.listen(port,()=>{
        console.log(`Server running on ${port}`)
    })
    app.on('error',(err)=>{
        console.error('EXPRESS SERVER ERROR !!! ',err)
    })
} catch(error){
    console.log('MONGODB CONNECTION FAILED !!! ',error);
}