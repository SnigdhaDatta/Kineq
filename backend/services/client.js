const Redis= require('ioredis');
require('dotenv').config();
const redisClient = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: 'default',
    password: process.env.REDIS_PASSWORD,
});
redisClient.on('ready', () => {
    console.log('Connected and authenticated to Redis Cloud');
});


redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});
module.exports = redisClient;