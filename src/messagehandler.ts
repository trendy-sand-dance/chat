import ClientManager from './clientmanager';
import { WebSocket } from "@fastify/websocket";
import { clientManager } from './clientmanager';
import { DATABASE_URL } from './config';

function isExcluded(socket: WebSocket, excludedSockets : WebSocket[]) : boolean {

	excludedSockets.forEach((s : WebSocket) => {
		if (socket === s)
			return true;
	});

	return false;

}

function isNumberPresentInArray(id: number, array: number[]) : boolean {

	console.log("IN NUMBER PRESNET");
	console.log("array length = ", array.length);
	for (let index = 0; index < array.length; index++) {
		console.log("array arg check = ", array[index]);
		console.log("ID check = ", id);
		if (id === array[index])
			return true;
	}
	return false;

}

// Utility
export function broadcastToRoom(message: RoomMessage, sessions: Session[], exclude: WebSocket[]) {

  sessions.forEach((session) => {
    if (session.socket.readyState == 1 && !isExcluded(session.socket, exclude)) {
      session.socket.send(JSON.stringify(message));
    }
  });

}

function getExcludedWebsockets(sessions : Session[], blockedUsers: Array<number>) : WebSocket[] {

	let array : WebSocket[] = [];

	console.log("sessions === ", sessions);
	for (let i = 0; i < sessions.length; i++) {
		console.log("IN FOR LOOP");
		console.log("blockedusers + length === ", blockedUsers, blockedUsers.length);
		if (isNumberPresentInArray(sessions[i].user.id, blockedUsers))
		{
			console.log("found id in array");
			array.push(sessions[i].socket);
		}
	}
	console.log("EX WEB SOCKS = ", array);
	return array;
}


// Message Handler
type MessageHandler = (data: ChatServerMessage, client: WebSocket) => void;

export const messageHandlers: Record<string, MessageHandler> = {

  "connect": (data: ChatServerMessage, client: WebSocket) => {
    const message: ConnectMessage = data as ConnectMessage;
    clientManager.addSession(client, message.user, message.room);
    const confirmMessage = {type:"confirm"};
    client.send(JSON.stringify(confirmMessage));
  },
  "disconnect": (data: ChatServerMessage, client: WebSocket) => {
    const message: DisconnectMessage = data as DisconnectMessage;
    clientManager.removeSession(message.id);
  },
  "room_chat": async (data: ChatServerMessage, client: WebSocket) => {
    const message: RoomMessage = data as RoomMessage;
    const sessions = clientManager.getSessionsFrom(message.room);
	// Get all the player ids that the client has blocked
	const response = await fetch(`${DATABASE_URL}/blocked/${message.id}`);
	const blockedUsers = await response.json() as Array<number>;
	console.log("blockedUsers", blockedUsers, blockedUsers.length);
	const excluded : WebSocket[] = getExcludedWebsockets(sessions, blockedUsers);
	console.log("EXCLUDED = ", excluded);
	excluded.push(client);

	// Send message to everyone except blocked IDs
    broadcastToRoom(message, sessions, excluded);
  },

};

