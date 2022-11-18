const Message = require('../models/Message')

const addMessage = async (req,res,next) => {
  try {
    
    const { from, to, message }= req.body

    const data = await Message.create({
        message: {text: message},
        users: [from, to],
        sender: from,
    })

    if (data) return res.status(200).send({msg: "Mensaje enviado"})
    return res.send({msg: "No se pudo enviar el mensaje"})

  } catch (error) {
    next(error)
  }
}

const getAllMessages = async (req,res,next) => {

    try {

      const { from ,to } = req.body

      const messages = await Message.find({
        users : {
          $all: [from , to]
        },
      }).sort({ updatedAt: 1})

      const projectMessages = messages.map((msg)=> {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        }
      })

      return res.status(200).send(projectMessages)

    } catch (error) {
      next(error)
    }
}

module.exports = {addMessage, getAllMessages}