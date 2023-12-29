import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { expressCspHeader, SELF } from 'express-csp-header';
import path from 'path';
import process from 'process';
import pug from 'pug';
import favicon from 'serve-favicon';
import { database } from './database.ts';

dotenv.config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('serverPort', process.env.SERVER_PORT);

app.use(cors());
app.use(
	expressCspHeader({
		directives: {
			'img-src': [SELF],
		},
	}),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(favicon(path.join(__dirname, '../assets', 'favicon.ico')));

app.get('/', (request: Request<{ filter?: string }>, response: Response) => {
	const {
		query: { filter = '' },
	} = request;
	const data = filter ? database.findBy({ name: filter.toString() }) : database.findAll() ?? [];
	const template = pug.compileFile(path.join(app.get('views'), 'index.pug'));
	const markup = template({ query: { filter }, list: data });

	response.set('Content-Type', 'text/html');
	response.send(markup);
});

app.get('/tasks/new', (_, response: Response) => {
	const template = pug.compileFile(path.join(app.get('views'), 'create.pug'));
	const markup = template();

	response.set('Content-Type', 'text/html');
	response.send(markup);
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
