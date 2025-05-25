import { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from '@fastify/websocket';
import ClientManager from '../clientmanager';
import { messageHandlers } from '../messagehandler';

const clientManager = new ClientManager();


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
