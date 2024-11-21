import { Resend } from "resend"
const resend = new Resend('re_RBwhgQhY_Gd3d292SS3NqgJMqP3aN7LGp')

export async function GET(request: Request) {
    const apikey = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['chtokeerjutt@gmail.com'],
        subject: 'Verification Code',
        html: '<p>Its Your Verification Code :123456</p>',
      });
    
    return Response.json({
        success:true,
        message:"Email sent!!",
        apikey
    },
    {
        status:200

    })
}