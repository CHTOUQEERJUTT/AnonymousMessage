import UserModel, { Message } from "@/models/User";
import connectDb from "@/lib/DB/connectDB";


export async function POST(request:Request){
    await connectDb();
    const {username,content} = await request.json();
    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
              );
        }
        if (!user.isAcceptingMessages) {
            return Response.json(
                { message: 'User is not accepting messages', success: false },
                { status: 403 } // 403 Forbidden status
              );
        }
        const newMessage = {content,createdAt:new Date()}

        user.message.push(newMessage as Message)
        await user.save()
        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
          );
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
          { message: 'Internal server error', success: false },
          { status: 500 }
        );
      }
}