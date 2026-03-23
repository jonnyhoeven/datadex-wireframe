import { type DropdownIndicatorProps, type GroupBase, components } from "react-select";
import type { AutocompleteProps, OptionType } from "./types";

export const DropdownIndicator = <IsMulti extends boolean>(
	props: DropdownIndicatorProps<OptionType, IsMulti, GroupBase<OptionType>> &
		Pick<AutocompleteProps, "dropdownIcon">,
) => {
	return <components.DropdownIndicator {...props}>{props.dropdownIcon}</components.DropdownIndicator>;
};
