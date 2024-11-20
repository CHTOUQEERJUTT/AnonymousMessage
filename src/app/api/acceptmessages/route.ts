import connectDb from "@/lib/DB/connectDB";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from 'next-auth';

export async function POST(request:Request){
    await connectDb();
    const session = await getServerSession(authOptions);
    const user:User = session?.user;
    if (!session || !session.user) {
        return Response.json(
          { success: false, message: 'Not authenticated' },
          { status: 401 }
        );
    }

    try {
        const userId = user._id;
        const {acceptMessages} = await request.json();
    
        const statusUpdated = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessages:acceptMessages,
           
        },{
            new:true
        })
        if (!statusUpdated) {
            return Response.json(
                {
                  success: false,
                  message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 }
              );
        }

        return Response.json(
            {
                success:true,
                message:"Status Updated Successfully",
                statusUpdated
            },
            {
                status:200
            }
        )


    } catch (error) {
        console.error('Error updating message acceptance status:', error);
        return Response.json(
          { success: false, message: 'Error updating message acceptance status' },
          { status: 500 }
        );
      }
    
}