import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getRoom, getRoomMessages, wsChatController } from '../controllers/wsChat.controller';

export async function routes(fastify: FastifyInstance) {

  // (Grove Street) "Home" 
  fastify.get('/', async function(request: FastifyRequest, reply: FastifyReply) {
    reply.send({ message: 'Hi from the Fastify chat server', method: request.method });
  });

  // Websocket connection
  fastify.get('/ws-chatserver', { websocket: true }, wsChatController);

  // Message storage controllers
  fastify.get('/getRoomMessages/:id', getRoomMessages);

};
