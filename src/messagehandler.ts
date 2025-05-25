import ClientManager from './clientmanager';
import { WebSocket } from "@fastify/websocket";
import { clientManager } from './clientmanager';

export function broadcastToRoom(message: RoomMessage, sessions: Session[], exclude: WebSocket | null) {

  sessions.forEach((session) => {
    if (session.socket.readyState == 1 && session.socket !== exclude) {
      session.socket.send(JSON.stringify(message));
    }
  });

}


// Message Handler
type MessageHandler = (data: ChatServerMessage, client: WebSocket) => void;

export const messageHandlers: Record<string, MessageHandler> = {

  "connect": (data: ChatServerMessage, client: WebSocket) => {
    const msg: ConnectMessage = data as ConnectMessage;
    clientManager.addSession(client, msg.user);
  },
  "disconnect": (data: ChatServerMessage, client: WebSocket) => {
    const msg: DisconnectMessage = data as DisconnectMessage;
    clientManager.removeSession(msg.id);
  },
  "room_chat": (data: ChatServerMessage, client: WebSocket) => {
    const msg: RoomMessage = data as RoomMessage;
    const sessions = clientManager.getSessionsFrom(msg.room);
    broadcastToRoom(msg, sessions, client);
  },

};


