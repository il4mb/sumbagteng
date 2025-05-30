import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export default socket;
