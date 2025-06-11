import ClientManager from './clientmanager';
import { WebSocket } from "@fastify/websocket";
import { clientManager } from './clientmanager';
import { DATABASE_URL } from './config';

// Utilities
function isExcluded(socket: WebSocket, excludedSockets: WebSocket[]): boolean {
  return excludedSockets.some((s) => socket === s);
}

function getExcludedWebsockets(sessions: Session[], blockedUsers: number[]): WebSocket[] {
  return sessions
    .filter(session => blockedUsers.indexOf(session.user.id) !== -1)
    .map(session => session.socket);
}

export function broadcastToRoom(message: RoomMessage, sessions: Session[], exclude: WebSocket[]) {

  sessions.forEach((session) => {
    if (session.socket.readyState == 1 && !isExcluded(session.socket, exclude)) {
      session.socket.send(JSON.stringify(message));
    }
  });

}

// Message Handler
type MessageHandler = (data: ChatServerMessage, client: WebSocket) => void;

export const messageHandlers: Record<string, MessageHandler> = {

  "connect": (data: ChatServerMessage, client: WebSocket) => {
    const message: ConnectMessage = data as ConnectMessage;
    console.log("connect message: ", message);
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
	const blockedUsers = await response.json() as number[];

	const excluded : WebSocket[] = getExcludedWebsockets(sessions, blockedUsers);
	excluded.push(client);

	// Send message to everyone except blocked IDs
    broadcastToRoom(message, sessions, excluded);

  },




  "personal_chat": async (data: ChatServerMessage, client: WebSocket) => 
	{
		const msg: WhisperMessage = data as WhisperMessage;


		const response = await fetch(`${DATABASE_URL}/blocked/${msg.toId}`);
		const blockedUsers = await response.json() as number[];

		 //check if sender is blocked by target
		if (blockedUsers.some((blockedID) => msg.fromId === blockedID))
			return (false);

		

		const targetSession : Session | undefined = clientManager.getSession(msg.toId);
		// excluded.push(client); ?? is this to send the bubble to user itself?

	if (targetSession && targetSession.socket.readyState == 1) {
		targetSession.socket.send(JSON.stringify(msg));
		}
	else
		console.log("couldnt send whisper :(");
	console.log("!!! whisper send!?");
  },





  "transition": (data: ChatServerMessage, client: WebSocket) => {
    const message: TransitionMessage = data as TransitionMessage;
    const roomTransition : RoomTransition = {id: message.id, from: message.from, to: message.to};
    console.log(`Player moved ${message.from} to ${message.to}!`);
    clientManager.transitionToRoom(roomTransition);
  }

};
