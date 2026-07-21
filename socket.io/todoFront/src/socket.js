import { io } from "socket.io-client";

const socket = io("http://localhost:3000/todo", {
  transports: ["websocket"],
});

export default socket;