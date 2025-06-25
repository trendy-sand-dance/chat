import { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from '@fastify/websocket';
import { clientManager } from '../clientmanager';
import { messageHandlers, messageStorage } from '../messagehandler';
import { RoomType } from "../types.d";
import { DATABASE_URL } from '../config';

export async function getRoomMessages(request: FastifyRequest, reply: FastifyReply) {

  const {id} = request.params as { id : number };

  const room : RoomType | undefined = clientManager.getRoom(id);
  if (room) {

    const messages : RoomMessage[] | undefined  = messageStorage.getAllMessagesFromRoom(room);
	  return reply.code(200).send({ messages });

  }
  else {
    return reply.code(404).send({error: "Could't fetch room messages"});
  }
};


export async function getRoom(request: FastifyRequest, reply: FastifyReply) {

  const {id} = request.params as { id : number };
	//   const userId = Number(request.params.id);

  const room : RoomType | undefined = clientManager.getRoom(id);
  if (room) {
    reply.code(200).send({ room: room });
  }
  reply.code(404).send({ room: "" });
};


export async function getMessageHistory(request: FastifyRequest, reply: FastifyReply)
{
	const {id} = request.params as { id : number };
	const room : RoomType | undefined = clientManager.getRoom(id);
	if (room == undefined)
		return reply.code(404).send({error: "Could't find user in any room!"});
  	const roomMessages : RoomMessage[] = messageStorage.getAllMessagesFromRoom(room) || [];
  	const whisperMessages : WhisperMessage[] = messageStorage.getAllWhispersToUser(id) || [];
	let combined = [...roomMessages, ...whisperMessages]
	.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
	.slice(-30);

	const blockedResponse = await fetch(`${DATABASE_URL}/blocked/${id}`);
	const blockedUsers = await blockedResponse.json() as number[];

	combined = combined.filter(message => {
		if ('fromId' in message) {
			return !blockedUsers.includes(message.fromId);
		}
		return !blockedUsers.includes(message.id);
	});

	 return reply.code(200).send({ messages: combined });
}


export async function wsChatController(client: WebSocket, request: FastifyRequest) {

  client.on('open', async (message: ChatServerMessage) => {
    client.send("Hello from the chat server!");
  });

  client.on('message', async (message: ChatServerMessage) => {

    try {

      const data: ChatServerMessage = JSON.parse(message.toString());
      console.log("Message: ", data);
      const handler = messageHandlers[data.type];

      if (handler) {
        handler(data, client);
      }
      else {
        console.error(`Unhandled message type: ${data.type}`);
      }
    }
    catch (error) {

      console.error("Failed to process message: ", error);

		}
	});


  client.on('close', async (message: ChatServerMessage) => {
    console.log("(On close) Server received.");
  });

  client.on('error', async (message: ChatServerMessage) => {
    console.error("(On error) Server received.");
    console.error(message);
  });

};
