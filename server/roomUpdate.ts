import { Socket } from "socket.io";
import { publicIO, playerRooms, rooms } from "./index";
import { generateWords } from "./generateWords";
import { Player } from "./types";

// export const createRoomHandler = (socket: Socket) => {
// 	socket.on("create room", (roomId: string, mode: string) => {
// 		if (publicIO.sockets.adapter.rooms.get(roomId)) {
// 			socket.emit("room already exist");
// 		} else {
// 			rooms[roomId] = {
// 				players: [],
// 				toType: generateWords(mode).join(" "),
// 				inGame: false,
// 				winner: null,
// 			};

// 			socket.emit("words generated", rooms[roomId].toType);
// 			socket.emit("create room success", roomId);
// 			// console.log(roomId);
// 			// console.log(publicIO.sockets.adapter.rooms.get(roomId));
// 			// const sockets = Array.from(publicIO.sockets.sockets).map((socket) => socket[0]);
// 			// console.log("room created: ", socket.rooms);
// 		}
// 	});
// };

export const updateRoomHandler = (socket: Socket) => {
	socket.on("room update", (user: Player) => {
		const { roomId } = user;
		if (!rooms[roomId]) return;
		const players = rooms[roomId].players;
		rooms[roomId].players = players.map((player) => (player.id !== user.id ? player : user));
		publicIO.in(roomId).emit("room update", rooms[roomId].players);
		console.log(rooms[roomId].players,roomId);
		

		// start game
		// const allPlayersReady = rooms[roomId].players.every((player) => player.isReady);
		// if (allPlayersReady) {
		// 	publicIO.in(roomId).emit("start game");
		// 	rooms[roomId].inGame = true;
		// } else {
		// 	rooms[roomId].inGame = false;
		// }
	});
};

export const joinRoomHander = (socket: Socket) => {
	socket.on("join room", ({ roomId, user }: { roomId: string; user: Player }) => {
		socket.emit("end game");
		const room = rooms[roomId];
		if (!room) {
			socket.emit("room invalid");
			return;
		} else if (rooms[roomId].inGame) {
			socket.emit("room in game");
			return;
		} else {
			rooms[roomId].players = [...rooms[roomId].players, user];
			playerRooms[socket.id] = [roomId];
		}

		socket.join(roomId);
		socket.emit("words generated", rooms[roomId].toType);
		publicIO.in(roomId).emit("room update", rooms[roomId].players);
		// socket.to(roomId).emit("notify", `${user.username} is here.`);
		// publicIO.in(roomId).emit("receive chat", { username: user.username, value: "joined", id: user.id, type: "notificatpublicIOn" });
		// console.log("join", rooms);
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