import express, { Application, Response,Request } from 'express'
import cors from 'cors'
const app:Application=express()

const port=process.env.PORT||5000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.get("/",(req:Request,res:Response)=>{
    res.send("Welcome to university management site!!!")
})
export default app;