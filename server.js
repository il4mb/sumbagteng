import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import cookie from "cookie";
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Store online users: uid -> socket.id
const onlineUsers = new Map();

app.prepare().then(() => {
	const httpServer = createServer(handler);
	const io = new Server(httpServer);

	global._io = io;

	io.on("connection", async (socket) => {
		console.log(`🔌 New socket connected: ${socket.id}`);

		try {
			// 1. Get session cookie from headers
			const rawCookies = socket.handshake.headers.cookie;
			const cookies = cookie.parse(rawCookies || "");
			const token = cookies.session;

			// 2. If token exists, auto-login
			if (token) {
				const { payload } = await jwtVerify(token, JWT_SECRET);
				const uid = payload.uid;

				// 3. Store in socket and map
				socket.data.userId = uid;
				onlineUsers.set(uid, socket.id);

				console.log(`✅ Auto-logged in user: ${uid}`);
				socket.emit("online-users", Array.from(onlineUsers.keys()));
			}

		} catch (err) {
			console.warn("⚠️ Failed to auto-login from cookie:", err.message);
		}

		socket.on("seek-online-users", () => {
			socket.emit("online-users", Array.from(onlineUsers.keys()));
		});

		// Manual login handler
		socket.on("login", async (token) => {
			try {
				if (!token) return;

				const { payload } = await jwtVerify(token, JWT_SECRET);
				const uid = payload.uid;

				socket.data.userId = uid;
				onlineUsers.set(uid, socket.id);

				console.log(`👤 Manual login: ${uid}`);
				socket.emit("online-users", Array.from(onlineUsers.keys()));
			} catch (err) {
				console.error("Login failed:", err.message);
			}
		});

		// Logout handler
		socket.on("logout", () => {
			const uid = socket.data.userId;
			if (uid) {
				onlineUsers.delete(uid);
				console.log(`👋 Logged out: ${uid}`);
				socket.emit("online-users", Array.from(onlineUsers.keys()));
			}
		});

		// Disconnect handler
		socket.on("disconnect", () => {
			const uid = socket.data.userId;
			if (uid) {
				onlineUsers.delete(uid);
				console.log(`❌ Disconnected: ${uid}`);
			} else {
				console.log(`❌ Disconnected socket: ${socket.id}`);
			}
		});
	});


	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});
