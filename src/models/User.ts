import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date;
}
export interface User extends Document{
    username:string;
    email:string;
    password:string;
    isVerified:boolean;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAcceptingMessages:boolean;
    message:Message[]
}
const messageSchema:Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
})
const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username Is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,"Please Enter A valid email"]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
      },
      verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
      },
      verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      isAcceptingMessages: {
        type: Boolean,
        default: true,
      },
      message:[messageSchema]
     

})
//Next js Work on edge-time means Server is Only activated When someone made a request To it
//So we have to look for when server is creating the model for 1st time or is it already created 
//So we have 2 cases

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);
