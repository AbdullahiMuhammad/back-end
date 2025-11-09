import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

export const createMessage = async (req, res) => {
    try {
    
      const newMessage = await Message.create(req.body);

      const currentChat = await Chat.findOneAndUpdate(
        {
          _id: req.body.chatId
        },
        {
          lastMessage: newMessage._id,
          $inc: {unreadMessage: 1}
        }
      );

      res.status(201).json({
        success: true,
        newMessage
      })


    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}