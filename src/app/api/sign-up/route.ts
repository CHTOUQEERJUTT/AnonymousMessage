import {sendVerificationEmail} from '@/helpers/sendVerificationEmail'
import UserModel from '@/models/User'
import connectDb from '@/lib/DB/connectDB'
import bcrypt from 'bcryptjs'

export async function POST(request:Request){
    await connectDb()

    try {
        const {username,email,password} = await request.json()
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })
        if (existingVerifiedUserByUsername) {
            return Response.json({
                success:false,
                message:"User Already exists and verified"
            },
            {
                status:500})
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode =  Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success:false,
                    message:"Already Verified by Email"
                })
            }
            const hashedPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save()

        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const newUser =new  UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessages: true,
            messages: [],
        })
        await newUser.save()
        
    } catch (error) {
    
    }
}
