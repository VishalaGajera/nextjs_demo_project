import { capitalize } from "lodash";
import type {
  SalaryStructureCategory,
  SalaryStructureDataItem,
  SalaryStructureOption,
  SalaryStructureOptions,
} from "../Hooks/useGetSalaryStructureOptions";
import type { OptionsType } from "../SalaryStructureOptionsAutoComplete";

type GetDynamicOptionsProps = {
  salaryStructureDataItem: SalaryStructureDataItem;
  optionType: OptionsType;
  structure_by: keyof SalaryStructureOptions;
  structure_type: keyof SalaryStructureCategory;
};

export const getDynamicOptions = ({
  salaryStructureDataItem,
  optionType,
  structure_by = "monthly",
  structure_type = "custom",
}: GetDynamicOptionsProps) => {
  if (!salaryStructureDataItem) {
    return [];
  }

  if (optionType === "structure_by") {
    return Object.keys(salaryStructureDataItem.options.value).map((key) => {
      return {
        label: capitalize(key),
        value: key,
      };
    });
  } else if (optionType === "structure_type") {
    return Object.keys(
      salaryStructureDataItem.options.value[structure_by]
    )?.map((key) => {
      return {
        label: capitalize(key),
        value: key,
      };
    });
  } else if (optionType === "structure_name") {
    return salaryStructureDataItem.options.value[structure_by]?.[
      structure_type
    ]?.map((item) => {
      if (structure_type === "ranges") {
        const rangeItems = item as SalaryStructureOption;

        return {
          label: `${rangeItems.label.from_range}-${rangeItems.label.to_range}`,
          value: rangeItems.value,
        };
      }

      return {
        label: typeof item.label === "string" ? item.label : "",
        value: item.value,
      };
    });
  }

  return [];
};
