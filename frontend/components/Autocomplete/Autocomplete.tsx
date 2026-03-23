import { useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import {
	type MultiValue,
	type SingleValue,
	type InputActionMeta,
	type SelectInstance,
	type ClassNamesConfig,
} from "react-select";
import { CustomOptionView } from "./Option";
import { CustomInput } from "./Input";
import { type AutocompleteType, type OptionType } from "./types";
import { DropdownIndicator } from "./DropdownIndicator";
import { useAutocompleteSearch } from "../../../../react-select-autocomplete/src/hooks/useAutocompleteSearch";

const customClassNames: ClassNamesConfig<OptionType> = {
	container: () => "w-full text-sm lg:w-80",
	input: () => "input-shadow-none",
};

const Autocomplete: AutocompleteType = ({ dropdownIcon, handleSelection = () => { }, ...props }) => {
	const [inputValue, setInputValue] = useState("");
	const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);

	const { loading, handleSearch, hasNoResults, lastFetchedOptions } = useAutocompleteSearch();

	const selectRef = useRef<SelectInstance<OptionType> | null>(null);
	const onChange = (selected: SingleValue<OptionType> | MultiValue<OptionType>) => {
		const opt = selected as OptionType;
		setSelectedOption(opt);
		setInputValue(opt ? opt.label : ""); // Ensure the input shows selected value
		handleSelection(opt);
	};

	const onInputChange = (inputValue: string, { action }: InputActionMeta) => {
		if (action === "input-change") {
			setInputValue(inputValue);
			if (inputValue.trim().length == 0 && selectedOption) {
				if (selectRef.current) selectRef.current.clearValue();
			}
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" && inputValue.trim()) {
			handleSelection({ value: inputValue, label: inputValue });
		}
	};

	const showNoOptions = hasNoResults && inputValue.trim().length > 0;
	const defaultOptions = inputValue.trim().length > 0
		? lastFetchedOptions
		: [];

	return (
		<AsyncSelect<OptionType>
			ref={selectRef}
			// to override the existing theme
			// @ref https://github.com/JedWatson/react-select/discussions/5448#discussioncomment-4014405
			theme={(theme) => ({
				...theme,
				colors: {
					...theme.colors,
					primary: "var(--color-cyan-400)",
					primary25: "var(--color-cyan-100)",
					primary50: "var(--color-cyan-200)",
					primary75: "var(--color-cyan-300)",
				},
			})}
			defaultOptions={defaultOptions}
			noOptionsMessage={() =>
				showNoOptions ? `No options found for "${inputValue}"` : null
			}
			cacheOptions
			loadOptions={handleSearch}
			isLoading={loading}
			components={{
				DropdownIndicator: (props) => <DropdownIndicator {...props} dropdownIcon={dropdownIcon} />,
				Input: CustomInput,
				IndicatorSeparator: () => null,
				Option: CustomOptionView,
			}}
			classNames={customClassNames}
			onKeyDown={handleKeyDown}
			{...props}
			inputValue={inputValue}
			onInputChange={onInputChange}
			onChange={onChange}
			value={selectedOption}
		/>
	);
};
export default Autocomplete;