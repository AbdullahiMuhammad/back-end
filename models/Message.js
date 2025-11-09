import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chatSchema'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema"
    },
    text: {
        type: String,
        require: true
    },
    read: {
        type: Boolean,
        default: false
    }
})

const Message = mongoose.model("messages", messageSchema);

export default Message;