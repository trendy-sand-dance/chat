import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { wsChatController } from '../controllers/wsChat.controller';

export async function routes(fastify: FastifyInstance) {
  fastify.get('/', async function(request: FastifyRequest, reply: FastifyReply) {
    reply.send({ message: 'Hi from the Fastify chat server', method: request.method });
  });

  fastify.get('/ws-chatserver', { websocket: true }, wsChatController);

};
