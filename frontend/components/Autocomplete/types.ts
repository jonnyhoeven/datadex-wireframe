import { type Props } from "react-select";

export type OptionType = {
	value: string;
	label: string;
};

export interface AutocompleteProps extends Partial<Props<OptionType, false>> {
	onChange: (value: OptionType | null) => void;
	dropdownIcon?: React.ReactNode;
	handleSelection?: (opt: OptionType) => void;
}

export type AutocompleteType = React.FC<
	Pick<AutocompleteProps, "placeholder" | "name" | "dropdownIcon" | "handleSelection" | "isClearable">
> & {};
