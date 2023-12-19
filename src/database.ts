import { every, filter, findIndex, maxBy } from 'lodash';

export type Task = { id: number; name: string; status: 'open' | 'in_progress' | 'close' };
type TasksWithAtLeastOneKey = { [K in keyof Task]: Pick<Task, K> };
type AtLeastOne = Partial<Task> & TasksWithAtLeastOneKey[keyof TasksWithAtLeastOneKey];

const listOfTasks: Task[] = [
	{
		id: 1,
		name: '1. Task',
		status: 'open',
	},
	{
		id: 2,
		name: '2. Task',
		status: 'in_progress',
	},
	{
		id: 3,
		name: '3. Task',
		status: 'close',
	},
];

export const database = {
	findAll: () => listOfTasks,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	findBy: (expression: Record<string, any>) =>
		filter<Task>(listOfTasks, (item) =>
			every(expression, (value, key) => key in item && item[key as keyof Task]?.toString().includes(value.toString())),
		) as Task[],
	save: ({ name, status }: Pick<Task, 'name' | 'status'>) => {
		const { id: latestId = 4711 } = maxBy(listOfTasks, 'id') ?? {};
		listOfTasks.push({
			id: latestId + 1,
			name,
			status,
		});
	},
	findOneAndUpdate(filter: Pick<Task, 'id'>, update: AtLeastOne) {
		const index = findIndex(listOfTasks, { id: Number(filter.id) });
		if (index !== -1) {
			listOfTasks[index] = {
				...listOfTasks[index],
				...update,
			};
		}
	},
	findOneAndRemove(filter: Pick<Task, 'id'>) {
		const index = findIndex(listOfTasks, { id: Number(filter.id) });
		listOfTasks.splice(index, 1);
	},
};
