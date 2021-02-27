export default interface LookupTaxon {
		score?: number;
		id: number
		name: string
		commonName?: string
		lookupSuccess?: boolean
}