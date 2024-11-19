import { z } from 'zod';
import UserModel from '@/models/User';
import connectDb from '@/lib/DB/connectDB';
import { usernameValidation } from '@/schemas/signup';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await connectDb();

  try {
    const { searchParams } = new URL(request.url);

    // Extract and validate query params
    const queryParams = { username: searchParams.get('username') };
    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      throw new Error('Invalid params are given');
    }

    const { username } = result.data;

    // Check if username exists
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Username Already Taken',
        }),
        { status: 400 } // 400 Bad Request
      );
    }

    // If username is unique
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Username is Unique',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error checking username',
      }),
      { status: 500 }
    );
  }
}
