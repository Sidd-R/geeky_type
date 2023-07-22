import { Socket } from "socket.io";
import { publicIO, playerRooms, rooms } from "./index";
import { generateWords } from "./generateWords";
import { Player } from "./types";

export const updateRoomHandler = (socket: Socket) => {
	socket.on("room update", (user: Player) => {
		const { roomId } = user;
		if (!rooms[roomId]) return;
		const players = rooms[roomId].players;
		rooms[roomId].players = players.map((player) => (player.id !== user.id ? player : user));
		publicIO.in(roomId).emit("room update", rooms[roomId].players);
		// console.log(rooms[roomId].players,roomId);
		
	});
};

export const leaveRoomHandler = (socket: Socket) => {
	socket.on("leave room", (user: Player) => {
		const { roomId } = user;
		const players = rooms[roomId];
		if (!players) return;
		rooms[roomId].players = players.players.filter((player) => {
			if (player.id === user.id) {
				socket.to(roomId).emit("leave room", player.username);
				// publicIO.in(roomId).emit("receive chat", { username: player.username, value: "left", id: player.id });
			}
			return player.id !== user.id;
		});

		publicIO.in(roomId).emit("room update", rooms[roomId].players);
		if (rooms[roomId].players.length === 0) {
			delete rooms[roomId];
		}
		// console.log("leave ", rooms);
	});
};


export const endGameHander = (socket: Socket) => {
	socket.on("end game", (roomId: string, mode: "words" | "sentences" | "numbers") => {
		// const toType = shuffleList(mode).join(" ");
		rooms[roomId] = {
			players: rooms[roomId].players,
			toType: "",
			inGame: false,
			winner: socket.id,
		};
		// console.log(socket.id);
		// publicIO.in(roomId).emit("winner", rooms[roomId].winner);
		publicIO.in(roomId).emit("end game", socket.id);
	});
};