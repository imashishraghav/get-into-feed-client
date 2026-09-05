import { startServer } from "./backend/server.js";

process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.PORT = process.env.PORT || 5000;

startServer();
