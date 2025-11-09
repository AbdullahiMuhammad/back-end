import mongoose from "mongoose";


const chatSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['channel', 'private'],
        require: true
    },
    name: {
       type: String,
       trim: true,
       default: null // for only group chat
    },
    members: [
        {
            user: {
              type: mongoose.Schema.Types.ObjectId, 
              ref: "userSchema"
            },
            role: {
              type: String,
              enum: ["member", "admin", "owner"],
              default: "member",
           },
           joinedAt: { 
              type: Date, 
              default: Date.now 
            },
        }
    ],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Message"
    },
    unreadMessageCount: {
        type: Number,
        default: 0
    },
   

}, {Timestamp: true});




const Chat = mongoose.model("chats", chatSchema); 
export default Chat;