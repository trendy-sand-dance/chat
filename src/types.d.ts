import { WebSocket } from "@fastify/websocket";

declare global {

  // Interfaces

  interface PlayerData {
    id: number,
    userId: number,
    x: number,
    y: number,
  }

  interface User {
    id: number,
    username: string,
    password?: string,
    email?: string,
    avatar: string,
    status: boolean,
    wins: number,
    losses: number,
    player: PlayerData,
  }

  interface Session {
    socket: WebSocket,
    user: User,
  }

  type Chat = {
    id1: number,
    id2: number,
  }

  // Types

  type ChatServerMessage = ConnectMessage | DisconnectMessage | TransitionMessage | RoomMessage | ChatMessage;

  type ConnectMessage = {
    type: string,
    user: User,
    room: RoomType,
  }

  type DisconnectMessage = {
    type: string,
    id: number,
  }

  type TransitionMessage = {
    type: string,
    id: number,
    from: RoomType,
    to: RoomType,
  }

  type RoomMessage = {
    type: string,
    id: number,
    message: string,
    timestamp: string,
    room: RoomType,
  }

  type ChatMessage = {
    type: string,
    fromId: number,
    toId: number,
    message: string,
    timestamp: string,
  }

  type RoomTransition = {
    type: string,
    id: number,
    from: RoomType,
    to: RoomType,
  }

}

export enum RoomType {
  Cluster = "cluster",
  Server = "server",
  Game = "game",
  Bocal = "bocal",
  Hall = "hall",
}

