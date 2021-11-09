export interface AutocompleteServerData {

	_id: {
		$oid: string
	};
	head: {
		vars: string[]
	};
	results: {
		bindings: [{
			identifier: {
				type: string;
				value: string;
			},
			label: {
				type: string;
				value: string;
			},
			description?: {
				type: string;
				value: string;
			}
		}]
	};
}
