/** Таксон, приходящий с йната. */
export interface JSONTaxonObject {
	/** Айди таксона. */
	id: number;
	/** Научное имя. */
	name: string;
	/** Таксономический ранг. */
	rank: string;
	/** Обычное имя. */
	preferred_common_name?: string;
	/** Категория. */
	iconic_taxon_name: string;

}