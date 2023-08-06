import mongoose from 'mongoose';
import app from './app';
import config from './config';


async function main() {
   try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connected successfully!!!");
    app.listen(config.port,()=>{
        console.log("Server listning on port ",config.port);
    })
   } catch (error:any) {
    console.log("database not connected   ",error.message);
   }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch(err => console.log(err));
