import { RoomType } from "./types.d";
import { WebSocket } from "@fastify/websocket";

export default class ClientManager {

  private _sessions: Map<number, Session> = new Map<number, Session>();
  private _rooms: Map<RoomType, Set<number>> = new Map<RoomType, Set<number>>();
  private _chats: Chat[] = [];

  public constructor() {

    for (const room of Object.values(RoomType)) {
      this._rooms.set(room, new Set());
    }

  }

  public addSession(socket: WebSocket, user: User): void {

    this._sessions.set(user.id, { socket, user });

  }

  public removeSession(id: number): boolean {

    console.log("Removing session: ", this._sessions.get(id));
    return this._sessions.delete(id);

  }

  public transitionToRoom({ id, from, to }: RoomTransition): void {

    this._rooms.get(from)?.delete(id); // Delete player from old room
    this._rooms.get(to)?.add(id); // Adds player to new room

  }

  public createChat(id1: number, id2: number): void {

    this._chats.push({ id1, id2 });

  }

  public getSession(id: number): Session | undefined {

    return this._sessions.get(id);

  }

  public getSessionsFrom(room: RoomType): Session[] {

    let sessions: Session[] = [];

    for (const id of this._rooms[room]) {

      const session = this._sessions.get(id);
      if (session) {
        sessions.push(session);
      }

    }

    return sessions;

  }


}

export const clientManager = new ClientManager();
