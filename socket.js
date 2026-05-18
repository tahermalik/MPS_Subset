import { io } from "socket.io-client";
import { BASE_URL } from "./src/pages/endpoints";

const socket = io(BASE_URL, {
  withCredentials: true
});

export default socket;