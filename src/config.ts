// file containing global settings for this service.

// TODO: Rename
// fastify specs
export const ADDRESS: string = process.env.LISTEN_ADDRESS ? process.env.LISTEN_ADDRESS : '0.0.0.0';
export const PORT: number = process.env.LISTEN_PORT ? parseInt(process.env.LISTEN_PORT, 10) : 3000;

// Endpoints
export const DATABASE_URL: string = process.env.DATABASE_URL || "http://database_container:3000";
export const USERMANAGEMENT_URL: string = process.env.USERMANAGEMENT_URL || "http://user_container:3000";
export const GAMESERVER_URL: string = process.env.GAMESERVER_URL || "http://gameserver_container:3000";
export const LOCAL_GAMESERVER_URL: string = process.env.LOCAL_GAMESERVER_URL || "localhost:8003";

