import connectDb from "@/lib/DB/connectDB";
import UserModel from "@/models/User";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(request:Request){
    await connectDb()
    const session = await  getServerSession(authOptions)

    const user = session?.user
    if (!session || !user) {
        return Response.json(
          { success: false, message: 'Not authenticated' },
          { status: 401 }
        );
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {$match:userId},
            {$unwind:"$message"},
            {$sort:{'message.createdAt':-1}},
            {$group:{_id:"$_id",message:{$push:'$message'}}}
        ]).exec()
        if (!user || user.length === 0) {
            return Response.json(
              { message: 'User not found', success: false },
              { status: 404 }
            );
          }
      
          return Response.json(
            { messages: user[0].messages },
            {
              status: 200,
            }
          );


    } catch (error) {
        console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
    }

}