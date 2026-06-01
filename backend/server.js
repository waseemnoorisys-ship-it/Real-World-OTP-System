// require("dotenv").config()
// require("./cron/sendWelcomeEmails")
// const express = require("express")
// const cors = require("cors")
// const helmet = require("helmet")
// const passport = require("passport")
// const cookieParser = require("cookie-parser")
// const connectDB = require("./config/db")
// const morgan = require("morgan")
// const statusMonitor = require("express-status-monitor")

// require("./config/passport")

// const authRoutes = require("./routes/authRoutes")
// const userRoutes = require("./routes/userRoutes")

// const app = express()

// connectDB()

// app.use(morgan("combined"))
// app.use(statusMonitor()) // Add status monitor middleware
// app.use(helmet())
// app.use(cookieParser())
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true
//   })
// )

// app.use(express.json())

// app.use(passport.initialize())

// app.use("/api/auth", authRoutes)

// app.use("/api/user", userRoutes)

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`)

// })

require("dotenv").config();

require("./cron/cronForSendingEmail");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const morgan = require("morgan");
const statusMonitor = require("express-status-monitor");
const socket = require("./socket"); // NEW
// NEW
const http = require("http");

// NEW
const { Server } = require("socket.io");

require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use(morgan("combined"));

app.use(statusMonitor()); // Add status monitor middleware

app.use(helmet());

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

// ==============================
// OLD EXPRESS SERVER
// ==============================

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`)
// })

// ==============================
// NEW HTTP SERVER FOR SOCKET.IO
// ==============================

// Create raw HTTP server and attach Express app
const server = http.createServer(app);

// Attach Socket.IO to HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
socket.setIO(io); // Set Socket.IO instance for use in cron/controllers
// Listen for realtime socket connections
io.on("connection", (socket) => {
  setTimeout(() => {

  socket.emit("welcome-popup", {
    message: "Welcome to Our Platform 🚀"
  });

}, 3000);
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export io so cron/controllers can use realtime events
module.exports = io;

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
