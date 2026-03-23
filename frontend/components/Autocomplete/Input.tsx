import { components, type GroupBase, type InputProps } from "react-select";
import type { OptionType } from "./types";

// Added a custom input field to enable editing of the selected tag in single select.
// @ref https://github.com/JedWatson/react-select/issues/1558#issuecomment-1476071839
export const CustomInput = <IsMulti extends boolean>(
	props: InputProps<OptionType, IsMulti, GroupBase<OptionType>>,
) => <components.Input {...props} isHidden={false} />;
