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
		console.log("getting whispers from userID: ", userId);
		console.log(`Current whisper map keys: ${Array.from(this._whisperMessages.keys())}`);

		// Ensure userId is treated as a number
		const numericUserId = Number(userId);
		console.log(`Looking up with numeric ID: ${numericUserId} (type: ${typeof numericUserId})`);
		
		const messages: WhisperMessage[] | undefined = this._whisperMessages.get(numericUserId);

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


		//could add db call to check for deleted server
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

		console.log(`Verification: Map now has entry for ${saveID}: ${this._whisperMessages.has(saveID)}`);

		// Debug check by manually retrieving the just-stored message
		const testRetrieve = this._whisperMessages.get(numericSaveID);
		console.log(`TEST: Can retrieve message for ${numericSaveID}? ${testRetrieve !== undefined}`);
		if (testRetrieve) {
		console.log(`TEST: Message count: ${testRetrieve.length}`);
		}

		// Let's check explicit keys right after storing
		const keysArray = Array.from(this._whisperMessages.keys());
		console.log(`TEST: Explicit key check - is ${numericSaveID} included?`, keysArray.includes(numericSaveID));
		console.log(`TEST: Explicit key check - key types:`, keysArray.map(k => typeof k));


		if (saveID != message.fromId)
			this.addWhisperMessage(message, message.fromId);
	}




}

//store all messags ✅




//when client clicks chat sidebar, client calls getmsg endpoint with said roomtype



//
// GetNumMessagesFromRoom
// GetWhisperMessagesFrom(userId, targetId);
