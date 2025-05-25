import { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from '@fastify/websocket';
import MessageHandler from '../messagehandler.js';
import ClientManager from '../clientmanager';
// import { RoomType } from '../types';

const clientManager = new ClientManager();
const messageHandler = new MessageHandler();

export async function wsChatController(client: WebSocket, request: FastifyRequest) {

  client.on('open', async (message: ChatServerMessage) => {
    client.send("Hello from the chat server!");
  });

  client.on('message', async (message: ChatServerMessage) => {

    console.log("(On message) Server received.");
    const data = JSON.parse(message.toString());
    console.log("Message: ", data);

    switch (data.type) {

      case "connect":
        clientManager.addSession(client, data.user);

        break;
      case "disconnect":
        clientManager.removeSession(data.id);
        break;

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
