const Message = require("../models/message");

//handles chat disconnect options
module.exports = (io) => {
  io.on("connection", (client) => {
    console.log("new connection");
    client.on("disconnect", () => {
      client.broadcast.emit("user disconnected");
      console.log("user disconnected");
    });
    // client.on("connect", () => {
    //   client.broadcast.emit("user joined");
    //   console.log("user joined");
    // });  
    client.on("message", (data) => {
      let messageAttributes = {
        content: data.content,
        name: data.userName,
        user: data.userId,
      };
      let m = new Message(messageAttributes);
      m.save()
        .then(() => {
          io.emit("message", messageAttributes);
        })
        .catch((error) => {
          console.log(`error: ${error.message}`);
        });
    });
    //loads previous messages
    Message.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .then((messages) => {
        client.emit("load all messages", messages.reverse());
      })
      .catch((error) => {
        console.log(`error: ${error.message}`);
      });
  });
};
