import defaultProjects from '../assets/projects.json';

export const DEFAULTS: Record<string, any> = {
	projects: defaultProjects
}

/** Вклад пользователя в проект. */
export enum USER_CONTRIBUTIONS {
	/** Виды, встреченные пользователем. */
	"OBSERVED" = "0",
	/** Виды, встреченные только этим пользователем. */
	"OBSERVED_ONLY" = "1",
	/** Виды, не встреченные этим пользователем в проекте. */
	"NOT_OBSERVED" = "2",
	/** Виды, никогда не встреченные этим пользователе. */
	"NEVER_OBSERVED" = "3",
	/** Виды проекта и виды, встреченные пользователем. */
	"MARK_OBSERVED" = "4",
}
