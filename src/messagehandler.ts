import ClientManager from './clientmanager';
import { WebSocket } from "@fastify/websocket";
import { clientManager } from './clientmanager';

// Utility
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
    const message: ConnectMessage = data as ConnectMessage;
    clientManager.addSession(client, message.user, message.room);
    const confirmMessage = {type:"confirm"};
    client.send(JSON.stringify(confirmMessage));
  },
  "disconnect": (data: ChatServerMessage, client: WebSocket) => {
    const message: DisconnectMessage = data as DisconnectMessage;
    clientManager.removeSession(message.id);
  },
  "room_chat": (data: ChatServerMessage, client: WebSocket) => {
    const message: RoomMessage = data as RoomMessage;
    const sessions = clientManager.getSessionsFrom(message.room);
    broadcastToRoom(message, sessions, client);
  },

};

