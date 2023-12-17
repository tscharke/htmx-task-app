import { every, filter, findIndex, maxBy } from 'lodash';

export type ToDo = { id: number; name: string; status: 'open' | 'in_progress' | 'close' };
type ToDoWithAtLeastOneKey = { [K in keyof ToDo]: Pick<ToDo, K> };
type AtLeastOne = Partial<ToDo> & ToDoWithAtLeastOneKey[keyof ToDoWithAtLeastOneKey];

const listOfToDo: ToDo[] = [
	{
		id: 1,
		name: '1. Item',
		status: 'open',
	},
	{
		id: 2,
		name: '2. Item',
		status: 'in_progress',
	},
	{
		id: 3,
		name: '3. Item',
		status: 'close',
	},
];

export const database = {
	findAll: () => listOfToDo,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	findBy: (expression: Record<string, any>) =>
		filter<ToDo>(listOfToDo, (item) =>
			every(expression, (value, key) => key in item && item[key as keyof ToDo]?.toString().includes(value.toString())),
		) as ToDo[],
	save: ({ name, status }: Pick<ToDo, 'name' | 'status'>) => {
		const { id: latestId = 4711 } = maxBy(listOfToDo, 'id') ?? {};
		listOfToDo.push({
			id: latestId + 1,
			name,
			status,
		});
	},
	findOneAndUpdate(filter: Pick<ToDo, 'id'>, update: AtLeastOne) {
		const index = findIndex(listOfToDo, { id: Number(filter.id) });
		if (index !== -1) {
			listOfToDo[index] = {
				...listOfToDo[index],
				...update,
			};
		}
	},
	findOneAndRemove(filter: Pick<ToDo, 'id'>) {
		const index = findIndex(listOfToDo, { id: Number(filter.id) });
		listOfToDo.splice(index, 1);
	},
};
