const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const redisClient = require("./services/client");
const UserRouter = require("./routes/user");
const { checkAuthentication } = require("./middlewares/authentication");
const ongoingRouter = require("./routes/ongoing");
const watchlistRouter = require("./routes/watchlist");
const completedRouter = require("./routes/completed");
const chatbotRouter = require("./routes/chatbot");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "kineq",
  })
  .then(() => console.log("Connected To MongoDb succesfully"))
  .catch((err) => console.log("Error Connecting to MongoDb", err));

app.use(
  cors({
    origin: process.env.client_url,
    credentials: true, // Allow cookies to be sent in cross-origin requests
    exposedHeaders: ["Authorization"],
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//app.use(checkAuthentication); // Apply the authentication middleware to all routes

app.use("/api/user", UserRouter);
app.use("/api/watchlist", checkAuthentication, watchlistRouter);
app.use("/api/ongoing", checkAuthentication, ongoingRouter);
app.use("/api/completed", checkAuthentication, completedRouter);
app.use("/api/chatbot",checkAuthentication, chatbotRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Kineq API" });
});

const server = app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});


// Graceful shutdown
let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }
  //signal can be SIGINT (Ctrl+C) or SIGTERM (termination signal) sent by the system or a process manager like PM2 when stopping the application.
  isShuttingDown = true;

  console.log(`${signal} received. Shutting down gracefully...`); 

  server.close(() => {
    console.log("HTTP server closed");
  });

  try {
    await redisClient.quit();
    console.log("Redis disconnected");
  } catch (redisError) {
    console.error(
      "Redis graceful shutdown failed, forcing disconnect:",
      redisError.message,
    );
    redisClient.disconnect();
  }

  try {
    await mongoose.connection.close();
    console.log("MongoDB disconnected");
  } catch (mongoError) {
    console.error("MongoDB shutdown error:", mongoError.message);
  }

  process.exit(0);
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
