import Chat from "../models/Chat.js"



export const createChat =  async (req, res) => {
    try {
      const newChat = await Chat.create(req.body);
      res.status(201).json({
        success: true,
        message: "chat created",
        newChat
      })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const getUserChat =  async (req, res) => {
    try {
        const userId = req.body.userId;
      const allChats = await Chat.find({"members.user" : userId}); 
      res.status(200).json({
        success: true,
        allChats
      })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}