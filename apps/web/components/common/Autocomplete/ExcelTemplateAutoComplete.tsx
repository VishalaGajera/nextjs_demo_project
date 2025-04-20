import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import type { FieldValues } from "react-hook-form";
import type { QueryParams } from "../../../constants/routes/settings/excel-template-configuration/routes";
import { useGetExcelTemplateOptions } from "./hooks/useGetExcelTemplateOptions";

type ExcelTemplateAutoCompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  queryParams?: QueryParams;
};

export const ExcelTemplateAutoComplete = <P extends FieldValues>({
  loading = false,
  queryParams = {},
  ...props
}: ExcelTemplateAutoCompleteProps<P>) => {
  const { data: excelTemplateOptions } = useGetExcelTemplateOptions({
    queryParams,
  });

  const updatedExcelTemplateOptions = useMemo(() => {
    return excelTemplateOptions?.map((template) => {
      return {
        ...template,
        label: template.company_name
          ? `${template.label} (${template.company_name})`
          : template.label,
        heading: template.master_name,
      };
    });
  }, [excelTemplateOptions]);

  return (
    <Autocomplete
      label="Excel Type"
      options={updatedExcelTemplateOptions}
      placeholder="Select Excel Type"
      loading={loading}
      {...props}
    />
  );
};
