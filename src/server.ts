import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import * as process from 'process';
import { database, Task } from './database.ts';
import { executeTemplating } from './templateEngine.ts';

dotenv.config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('serverPort', process.env.SERVER_PORT);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (request: Request<{ filter?: string }>, response: Response) => {
	const {
		query: { filter = null },
	} = request;

	const data = filter ? database.findBy({ name: filter.toString() }) : database.findAll();

	const customProcessingTemplateItems = {
		itemName: 'query',
		data: [{ filter: filter ?? '' }],
	};
	const mainContent = readFileSync(app.get('views') + '/index.html', { encoding: 'utf-8' });
	const result = executeTemplating<Task>(mainContent, data, customProcessingTemplateItems);

	response.header('Content-Security-Policy', "img-src 'self'");
	response.set('Content-Type', 'text/html');
	response.send(result);
});

app.get('/tasks/new', (_, response: Response) => {
	const mainContent = readFileSync(app.get('views') + '/create.html', { encoding: 'utf-8' });
	const result = executeTemplating<Task>(mainContent, []);

	response.set('Content-Type', 'text/html');
	response.send(result);
});

app.post('/tasks/new', (request: Request, response: Response) => {
	const {
		body: { name, status },
	} = request;

	database.save({ name, status });

	response.redirect('/');
});

app.post('/tasks/status', (request: Request, response: Response) => {
	const {
		body: { id, status },
	} = request;

	database.findOneAndUpdate({ id }, { status });

	response.redirect('/');
});

app.post('/tasks/:id/delete', (request: Request<{ id: number }>, response: Response) => {
	const {
		params: { id },
	} = request;

	database.findOneAndRemove({ id });

	response.redirect('/');
});

app.all('*', (_, response: Response) => response.redirect('/'));

app.listen(app.get('serverPort'), () => {
	console.log(`Server is listening on port ${app.get('serverPort')}!`);
});
