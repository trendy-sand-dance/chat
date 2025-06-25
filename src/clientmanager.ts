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

  public addSession(socket: WebSocket, user: User, room : RoomType): void {

    console.log("We're adding: ", user, " to ", room);

    this._sessions.set(user.id, { socket, user });
    this._rooms.get(room)?.add(user.id);

    console.log("this_rooms.get(room): ", this._rooms.get(room));

  }

	public getRoom(userId: number): RoomType | undefined
	{
		for (const [rooms, players] of this._rooms)
		{
			if(players.size > 0 && players.has(Number(userId))) 
			return rooms;
		}
		console.log("cant find current player in any room!");
		return undefined;
	}


  public removeSession(id: number): boolean {

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

    const ids = this._rooms.get(room);

    if (ids) {
      for (const id of ids) {
        const session = this._sessions.get(id);
        if (session) {
          sessions.push(session);
        }

      }
    }
    return sessions;
  }
}

export const clientManager = new ClientManager();
