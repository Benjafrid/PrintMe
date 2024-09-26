import pg from 'pg';
import 'dotenv/config';

const {Client} = pg;

export const client = new Client ({
    "password" : process.env.DB_PASSWORD,
    "user" : process.env.DB_USER,
    "host" : process.env.DB_HOST,
    "database" : process.env.DB_DATABASE, 
    "port" : process.env.DB_PORT,
    "ssl" : "true"
});

export default client;