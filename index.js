const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    // origin: ["http://localhost:3000", "https://go-out-together.vercel.app"]
    origin: "*",
    // origin: true,
    methods: ["GET", "POST"],
  },
});

app.use(cors());
io.on("connection", (socket) => {
  // new user come into session
  socket.on("new_user_coming", (sid) => {
    socket.join(sid);
    socket.broadcast.emit("refetch_sesion_detail");

    // add new locations
    socket.on("add_location", (sid) => {
      socket.join(sid);
      io.to(sid).emit("refetch_add_location");
    });

    // delete new locations
    socket.on("delete_location", (sid) => {
      socket.join(sid);
      io.to(sid).emit("refetch_delete_location");
    });

    // vote location
    socket.on("vote", (sid) => {
      socket.join(sid);
      io.to(sid).emit("refetch_vote");
    });

    // change bgClassname
    socket.on("new_bg_image", ({ newBgClassname, sid }) => {
      socket.join(sid);
      socket
        .to(sid)
        .emit("change_new_bg_image", newBgClassname);
    });
  });
});

const port = process.env.PORT ?? 8080;
// app.listen(port, () => console.log(`Server is running at port ${port}`))
httpServer.listen(port, () => console.log(`Port ${port}`));
