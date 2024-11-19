const express=require("express")
const bodyparser=require("body-parser")
const app=express()
const cors=require("cors")
app.use(bodyparser.json())
const route=require("./routes/auth")
app.use(cors())
app.use("/",route)
const db=require("./config/db")
app.listen(4000,function() {
    console.log("port is working on 4000");
    
})