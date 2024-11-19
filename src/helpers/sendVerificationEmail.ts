import { resend } from "@/lib/resendConfig";
import VerificationEmail from "../../emails/resendTemplate";
import  ApiResponse  from '@/types/apiResponse';

export async function sendVerificationEmail(
    email:string,
    username:string,
    otp:string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp}),
          });
          return { success: true, message: 'Verification email sent successfully.' };
    } catch (error) {
        return { success: false, message: 'Verification email sent successfully.' };
    }
  }