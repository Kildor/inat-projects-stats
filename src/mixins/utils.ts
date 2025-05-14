import { Taxon } from 'DataObjects';

export const makeCsvString = (...args: Array<string | number | null | undefined>) =>
	args.filter(arg => arg !== null && arg !== undefined).map(arg => typeof arg === 'string' ? `"${arg.replace(/(?<!\\)"/g, '\\"')}"` : arg).join('\t');

export const DateTimeFormat = new Intl.DateTimeFormat([...navigator.languages], {
	year: 'numeric', month: 'numeric', day: 'numeric',
	hour: 'numeric', minute: 'numeric', second: 'numeric'
});

export const DateFormat = new Intl.DateTimeFormat([...navigator.languages], {
	dateStyle: 'short'
});

interface CreateQueryRequestParams {
	taxon?: Taxon;
	limit?: number;
	place_id?: number;
	species_only?: boolean;
	project_id?: string;
	user_id?: string;
	additional?: string;
	unobserved_by_user_id?: string;
	quality_grade?: string
};

export const createQueryRequest = (values: CreateQueryRequestParams): Record<string, string | number> => {
	const { taxon, place_id, additional, limit, species_only, quality_grade } = values;

	let customParams: Record<string, string | number> = {};
	if (limit as number > 0) customParams['limit'] = limit as number;
	if (!!taxon && taxon.id > 0) customParams['taxon_id'] = taxon.id;
	if (!!place_id && !isNaN(place_id)) customParams['place_id'] = place_id;
	if (species_only) {
		customParams['lrank'] = 'species';
		customParams['hrank'] = 'species';
	}
	if (quality_grade) customParams['quality_grade'] = quality_grade;

	if (additional) {
		additional.split('&').forEach((p: string) => {
			const param = p.split('=');
			if (param.length === 2) customParams[param[0]] = param[1];
		});
	}

	return customParams;
};
