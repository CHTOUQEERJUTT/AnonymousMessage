import CredentialsProvider from "next-auth/providers/credentials"
import connectDb from "@/lib/DB/connectDB"
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from "next-auth";
export const authOptions: NextAuthOptions = {
providers: [
  CredentialsProvider({
    // _id:'Credentials',
    name: 'Credentials',
    
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any):Promise<any> {
      await connectDb();
      try {
        const user = await UserModel.findOne({
            $or:[{username:credentials.identifier},{email:credentials.identifier}]
        })
        if (!user) {
            throw new Error('No user Found')
        }
        if (!user.isVerified) {
            throw new Error('Please Verify Your account First')
        }
        const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
        if (isPasswordCorrect) {
            return user
        }else{
            throw new Error('Incorrect Password')
        }
      } catch (error:any) {
        throw new Error(error)

        
      }
    }
  })
],
callbacks: {
   
    async jwt({ token, user}) {
        if (user) {
            token._id = user._id?.toString()
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            token.username = user.username;
        }
        return token
      },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session
    },
    
    

},
session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
}
