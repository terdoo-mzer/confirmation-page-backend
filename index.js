const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = 3000

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (replace with your frontend URL in production)
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("startProfiling", () => {
    simulateProfiling(socket);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const simulateProfiling = async (socket) => {
  const mockAPIs = [
    { name: "Credit Score Check", delay: 2000, result: "Good" },
    { name: "Employment Verification", delay: 3000, result: "Bad" },
    { name: "Address Check", delay: 1500, result: "Good" },
    { name: "Bank Statement Analysis", delay: 2500, result: "Good" },
  ];

  for (const api of mockAPIs) {
    await new Promise((resolve) => setTimeout(resolve, api.delay));
    socket.emit("apiCheckComplete", {
      check: api.name,
      result: api.result,
    });
  }

  socket.emit("profilingComplete", {
    message: "All checks completed!",
  });
};

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});