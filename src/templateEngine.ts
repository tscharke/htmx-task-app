import { readFileSync } from 'fs';

const INCLUDE_PATTERN = /{%\s*include\s*'([^']*)'\s*%}/g;
const EMPTY_VALUE = '';

type TemplateItem<T> = {
	data: ReadonlyArray<T>;
	template: string;
	itemName: string;
};
export const processTemplateItem = <T>({ data, template, itemName }: TemplateItem<T>): string => {
	let result = '';
	for (const item of data) {
		let itemResult = template;
		for (const key in item) {
			itemResult = itemResult.replace(new RegExp(`{{% ${itemName}.${key} %}}`, 'g'), `${item[key]}`);
		}
		result += itemResult;
	}
	return result;
};

const processForLoopTemplate = <T>(template: string, allDataElements: ReadonlyArray<T>): string => {
	const iteratorMatch = template.match(/\{% for (.+?) in .+? %\}/);
	if (!iteratorMatch) return template;

	const listMatch = template.match(/\{% for .+? in (.+?) %\}/);
	if (!listMatch) return template;

	const loopTemplateMatch = template.match(/\{% for .+? in .+? %\}([\s\S]*?)\{% endFor %\}/);
	if (!loopTemplateMatch) return template;

	const result = processTemplateItem({
		data: allDataElements,
		template: loopTemplateMatch[1],
		itemName: iteratorMatch[1],
	});
	return template.replace(/\{% for .+? in .+? %\}([\s\S]*?)\{% endFor %\}/, result);
};

export const executeTemplating = <T>(
	content: string,
	data: T[],
	processingTemplateItems?: Omit<TemplateItem<unknown>, 'template'>,
): string =>
	content.replace(INCLUDE_PATTERN, (_, fileName) => {
		try {
			const templateContent = readFileSync(`./src/${fileName}`, { encoding: 'utf-8' });
			const result = processForLoopTemplate(templateContent, data);
			return processingTemplateItems
				? processTemplateItem({
						...processingTemplateItems,
						template: result,
					})
				: result;
		} catch (error) {
			console.error('[executeTemplating]:', error);
			return EMPTY_VALUE;
		}
	});
