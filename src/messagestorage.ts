import { RoomType } from "./types.d";

export default class MessageStorage
{

	private _roomMessages : Map<RoomType, RoomMessage[]> = new Map<RoomType, RoomMessage[]>();
	private _whisperMessages: Map<number, WhisperMessage[]> = new Map<number, WhisperMessage[]>();
	private _maxRoomMessages : number = 20;
	private _maxWhisperMessages : number = 20;



	public constructor() {
	  console.log("MessageStorage instance created");
	  for (const room of Object.values(RoomType)) {
	    this._roomMessages.set(room, new Array);
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

	public getAllWhispersToUser(userId: number)
	{
		// Ensure userId is treated as a number
		const numericUserId = ;
		console.log(`Looking up with numeric ID: ${numericUserId} (type: ${typeof numericUserId})`);
		
		const messages: WhisperMessage[] | undefined = this._whisperMessages.get(Number(userId));

		if (messages == undefined) {
			console.log("couldn't find any whispers");
			return [];
		}
		return messages;
	}

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


	public addWhisperMessage(message : WhisperMessage, saveID : number)
	{

		const numericSaveID = Number(saveID);
		console.log("adding msg: ", message.message, " from: ", message.fromId);

		const array = this._whisperMessages.get(numericSaveID);
		if (array)
		{
			console.log(`Found existing message array for ${saveID}, length: ${array.length}`);

			array.push(message);
			if (array.length > this._maxWhisperMessages) {
				console.log(`Array exceeded max length, removed oldest message`);
				array.shift();
			}
		}
		 else
			this._whisperMessages.set(saveID, [message]);

		if (saveID != message.fromId)
			this.addWhisperMessage(message, message.fromId);
	}




}

//store all messags ✅




//when client clicks chat sidebar, client calls getmsg endpoint with said roomtype



//
// GetNumMessagesFromRoom
// GetWhisperMessagesFrom(userId, targetId);
