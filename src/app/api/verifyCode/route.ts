import connectDb from "@/lib/DB/connectDB";
import UserModel from "@/models/User";

export async function GET(request:Request){
    await connectDb();

    try {
        const {username,verifyCode} = await request.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({decodedUsername})
        if (!user) {
            return Response.json({
                success:false,
                message:"User not found"
            })
        }
        const isCodeValid = user.verifyCode === verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save()
            return Response.json({
                success:true,
                message:"User verified Successfully"
            },{
                status:200
            })
        }
        if (!isCodeValid) {
            return Response.json({
                success:false,
                message:"OTP entered Is incorrect"
        })};
        if (!isCodeNotExpired) {
            return Response.json({
                success:false,
                message:"Verify Code has expired"
            })
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json(
          { success: false, message: 'Error verifying user' },
          { status: 500 }
        );
      }

}
