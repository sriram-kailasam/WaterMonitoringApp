import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import {Client, ClientConfig} from 'pg';
import http = require('http');
import socketIO = require('socket.io');

require('dotenv').config();

import {IndexRouter} from './routes/index.routes';
import {WaterBodyRouter} from './routes/water_body.routes';
import {ApiRouter} from './routes/api.router';
import {SocketEventDispactcher} from './socket_event_dispatcher';

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
app.use('/api', ApiRouter);
app.use('/waterbodies', WaterBodyRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404);
	next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
	if (res.statusCode === 404) {
		res.render('404');
		res.end();
	}
});

const port = Number(process.env.PORT) || 8080;

const server: http.Server = http.createServer(app);

const socketServer = socketIO(server);

let eventDispatcher = new SocketEventDispactcher();
eventDispatcher.registerHandlers(socketServer);

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});