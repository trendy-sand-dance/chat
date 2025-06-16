import { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from '@fastify/websocket';
import ClientManager from '../clientmanager';
import { messageHandlers, messageStorage } from '../messagehandler';
import { RoomType } from "../types.d";

// enum RoomType {
//   Cluster = "cluster",
//   Server = "server",
//   Game = "game",
//   Bocal = "bocal",
//   Hall = "hall",
//   Toilet = "toilet",
// }

const clientManager = new ClientManager();

export async function getRoomMessages(request: FastifyRequest, reply: FastifyReply) {

  const {id} = request.params as { id : number };

  const room : RoomType | undefined = clientManager.getRoom(id);
  console.log("DO WE GET ID?: ", id);
  console.log("DO WE GET THE ROOM?: ", room);
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

  const room : RoomType | undefined = clientManager.getRoom(id);
  if (room) {
    reply.code(200).send({ room: room });
  }
  reply.code(404).send({ room: "" });
};


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
