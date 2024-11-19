import mongoose from "mongoose";



type ConnectionObject = {
    isConnected?:number;
}
const connection : ConnectionObject = {}

//Here We have To check whether DB is already Connected Or Not??
async function connectDb(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already Connected To Db");
        return
        
    }
    try {
        // const DB = await mongoose.connect(process.env.MONGODB_URI);
        // connection.isConnected = DB.connections[0].readyState

    } catch (error) {
        console.error("Failed To connect to Db",error)
        process.exit(1)
    }
    
}
export default connectDb
