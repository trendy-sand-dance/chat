import { RoomType } from "./types.d";

export default class MessageStorage
{

	private _roomMessages : Map<RoomType, RoomMessage[]> = new Map<RoomType, RoomMessage[]>();
	private _whisperMessages: Map<number, WhisperMessage[]> = new Map<number, WhisperMessage[]>();
	private _maxRoomMessages : number = 20;
	private _maxWhisperMessages : number = 20;



	public constructor()
	{
		for (const room of Object.values(RoomType)) {
			this._roomMessages.set(room, new Array); // ? Might go wrong
		}
	}

  	// Getters
	public  getAllMessagesFromRoom(room : RoomType) : RoomMessage[] | undefined 
	{

		const messages = this._roomMessages.get(room);
	//    filter fetch(db/getBlockedUsers/:id);
	//    returns messages (xcept for the blocked)
		return messages;
	}

	// public getAllWhispersUsers(room)

	public addRoomMessage(message : RoomMessage) : void 
	{
		const array = this._roomMessages.get(message.room);
		if (array)
		{
			array.push(message);
			if (array.length > this._maxRoomMessages)
				array.shift();
		}
		else
			console.log("\n---can't find roomtype to sotre msg\n---\n");

	}


	public addWhisperMessage(message : WhisperMessage)
	{
		//could add db call to check for deleted server
		const array = this._whisperMessages.get(message.toId);
		if (array)
		{
			array.push(message);
			if (array.length > this._maxWhisperMessages)
				array.shift();
		}
		 else
			this._whisperMessages.set(message.toId, [message]);
	}




}

//store all messags ✅




//when client clicks chat sidebar, client calls getmsg endpoint with said roomtype



//
// GetNumMessagesFromRoom
// GetWhisperMessagesFrom(userId, targetId);
