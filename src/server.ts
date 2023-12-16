import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import * as process from 'process';

dotenv.config();

const port = process.env.SERVER_PORT;

const app = express();
app.use(cors());

app.get('/', (_req: Request, response: Response) => {
	response.set('Content-Type', 'text/html');
	response.sendFile('index.html', { root: './src' });
});

app.get('/assets/:asset', (request: Request<{ asset: string }>, response: Response) => {
	const {
		params: { asset },
	} = request;

	response.set('Content-Type', 'image/png');
	response.sendFile(asset, { root: './assets' });
});

app.all('*', (_, response: Response) => response.redirect('/'));

app.listen(port, () => {
	console.log(`Server is listening on port ${port}!`);
});
