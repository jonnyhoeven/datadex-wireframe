import clsx from "clsx";
import { components, type GroupBase, type OptionProps } from "react-select";
import type { OptionType } from "./types";

export const CustomOptionView = <IsMulti extends boolean>(
	props: OptionProps<OptionType, IsMulti, GroupBase<OptionType>>,
) => {
	const { data, isSelected } = props;

	return (
		<components.Option {...props}>
			<div
				className={clsx("flex items-center gap-0.5 rounded-sm p-1", {
					"text-[var(--color-black)]": isSelected,
				})}
			>
				<span className="flex-1 overflow-hidden truncate whitespace-nowrap text-sm" title={data.label}>
					{data.label}
				</span>
			</div>
		</components.Option>
	);
};
