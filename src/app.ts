import express, { Application } from 'express'
const app:Application=express()
const port=process.env.PORT||5000
app.get("/",(req,res)=>{
    res.send("Welcome to university management site!!!")
})
export default app;