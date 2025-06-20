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

  type ChatServerMessage = ConnectMessage | DisconnectMessage 
  | TransitionMessage | RoomMessage
  | WhisperMessage | InvitationMessage | AnnouncementMessage;

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
	username: string,
    message: string,
    timestamp: string,
    room: RoomType,
  }

  type WhisperMessage = {
    type: string,
    fromId: number,
	fromUsername: string,
    toId: number,
	toUsername: string,
    message: string,
    timestamp: string,
  }

  type RoomTransition = {
    id: number,
    from: RoomType,
    to: RoomType,
  }

  type InvitationMessage = { // Invite for a 1v1 game
    type: string,
    fromId: number,
    toId: number,
  }

  type AnnouncementMessage = { // Tournament match announcement
    type: string,
    id1: number,
    id2: number,
  }

}

export enum RoomType {
  Cluster = "cluster",
  Server = "server",
  Game = "game",
  Bocal = "bocal",
  Hall = "hall",
  Toilet = "toilet",
}

