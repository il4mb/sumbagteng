import { io, Socket } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? "https://sumbagteng.vercel.app.com:3000" : "http://localhost:3000";

const socket = io(URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export default socket;
