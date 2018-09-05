import express from 'express';
import path from 'path';
import {Client, ClientConfig} from 'pg';
import socketIO = require('socket.io');

require('dotenv').config();

import {IndexRouter} from './routes/index.routes';
import {WaterBodyRouter} from './routes/water_body.routes';

const app: express.Application = express();

const dbConnectionConfig: ClientConfig = {
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	keepAlive: true
};
const dbClient = new Client(dbConnectionConfig);

dbClient.connect()
	.then(() => console.log("Connected to database"))
	.catch(err => console.error(err));

export const DbClient: Client = dbClient;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/', IndexRouter);
app.use('/waterbody', WaterBodyRouter);

const port = Number(process.env.PORT) || 8080;

export const Server = app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

let socketOptions;
export const SocketServer = socketIO(Server);