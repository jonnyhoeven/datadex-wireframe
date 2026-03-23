import { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { OptionType } from "../components/Autocomplete/types";
import { colourOptions } from "../constants/data";

const filterFn = (inputValue: string) => {
	return colourOptions.filter((i) =>
		i.label.toLowerCase().includes(inputValue.toLowerCase())
	);
};

export const useAutocompleteSearch = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [hasNoResults, setHasNoResults] = useState(false);
	const [lastFetchedOptions, setLastFetchedOptions] = useState<OptionType[]>([...colourOptions]);


	const handleSearch = useCallback(
		debounce((inputValue: string, callback: (options: OptionType[]) => void) => {
			if (!inputValue.trim()) {
				setHasNoResults(false);
				callback([]);
				return;
			}

			setLoading(true);

			// mocking the response of options
			setTimeout(() => {
				const filtered = filterFn(inputValue);
				callback(filtered);
				setLastFetchedOptions(filtered);
				setHasNoResults(!filtered.length);
				setLoading(false);
			}, 1000);

			// TODO: work with actual api
			// fetchAutoCompleteProducts(inputValue)
			// 	.then((response) => {
			// 		if (response) {
			// 			const suggestions = response.suggestedValues
			// 			callback(suggestions);
			// 		} else {
			// 			callback([]);
			// 		}
			// 	})
			// 	.catch((e) => {
			// 		console.error("Error fetching autocomplete search list", e);
			// 		callback([]);
			// 	})
			// 	.finally(() => setLoading(false));
		}, 300), // Debounce delay
		[],
	);

	return { handleSearch, loading, hasNoResults, lastFetchedOptions };
};
