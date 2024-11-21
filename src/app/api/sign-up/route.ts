import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import UserModel from '@/models/User';
import connectDb from '@/lib/DB/connectDB';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    await connectDb();

    try {
        const { username, email, password } = await request.json();

        // Check if a verified user exists with the same username
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (existingVerifiedUserByUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User already exists and verified",
                }),
                { status: 400 }
            );
        }

        // Check if a user exists with the same email
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "Already verified by email",
                    }),
                    { status: 400 }
                );
            }

            // Update the existing user's password and verification code
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1-hour expiry
            await existingUserByEmail.save();

            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Verification code resent to email",
                }),
                { status: 200 }
            );
        }

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date(Date.now() + 3600000); // 1-hour expiry
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessages: true,
            messages: [],
        });
        await newUser.save();
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
          );
          if (!emailResponse.success) {
            return Response.json(
              {
                success: false,
                message: emailResponse.message,
              },
              { status: 500 }
            );
          }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully",
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST /api/sign-up:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error",
            }),
            { status: 500 }
        );
    }
}
