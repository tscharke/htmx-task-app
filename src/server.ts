import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { readFileSync } from 'fs';
import * as process from 'process';
import { database, ToDo } from './database.ts';
import { executeTemplating } from './templateEngine.ts';

dotenv.config();

const PORT = process.env.SERVER_PORT;

const app = express();
app.use(cors());

app.get('/', (request: Request<{ filter?: string }>, response: Response) => {
	const {
		query: { filter = null },
	} = request;

	const data = filter ? database.findBy({ name: filter.toString() }) : database.findAll();

	const customProcessingTemplateItems = {
		itemName: 'query',
		data: [{ filter: filter ?? '' }],
	};
	const mainContent = readFileSync('./src/index.html', { encoding: 'utf-8' });
	const result = executeTemplating<ToDo>(mainContent, data, customProcessingTemplateItems);

	response.set('Content-Type', 'text/html');
	response.send(result);
});

app.get('/assets/:asset', (request: Request<{ asset: string }>, response: Response) => {
	const {
		params: { asset },
	} = request;

	response.set('Content-Type', 'image/png');
	response.sendFile(asset, { root: './assets' });
});

app.all('*', (_, response: Response) => response.redirect('/'));

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}!`);
});
