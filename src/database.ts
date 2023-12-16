import { every, filter } from 'lodash';

export type ToDo = { id: number; name: string; status: 'open' | 'in_progress' | 'close' };

const listOfToDos: ToDo[] = [
	{
		id: 4711,
		name: '1. Item',
		status: 'open',
	},
	{
		id: 4712,
		name: '2. Item',
		status: 'in_progress',
	},
	{
		id: 4713,
		name: '3. Item',
		status: 'close',
	},
];

export const database = {
	findAll: () => listOfToDos,
	findBy: (expression: Record<string, string>) =>
		filter<{ [key: string]: any }>(listOfToDos, (item) =>
			every(
				expression,
				(value, key) => item[key] && typeof item[key] === 'string' && item[key].toLowerCase().includes(value),
			),
		) as ToDo[],
};
