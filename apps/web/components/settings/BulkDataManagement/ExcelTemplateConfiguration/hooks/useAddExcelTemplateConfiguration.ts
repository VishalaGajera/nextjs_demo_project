"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { EXCEL_TEMPLATE_ROUTES } from "../../../../../constants/routes/settings/excel-template-configuration/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { excelTemplateKeys } from "../../../../../queryKeysFactories/excelTemplate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { ExcelConfigurationFormFieldValues } from "../ExcelTemplateConfigurationForm";

type AddExcelTemplateConfigurationApiSuccessResponse = ApiSuccessResponse<null>;

type ExcelTemplateFields = {
  id: string;
  template_field_name: string;
};

export type ExcelConfigurationPayload = {
  excel_template_fields: ExcelTemplateFields[];
  company_id?: ExcelConfigurationFormFieldValues["company_id"];
  excel_master_id?: ExcelConfigurationFormFieldValues["excel_master_id"];
  template_name: ExcelConfigurationFormFieldValues["template_name"];
};

type AddExcelTemplateConfigurationArgs = {
  options: UseMutationOptions<
    AddExcelTemplateConfigurationApiSuccessResponse,
    ApiErrorResponse<ExcelConfigurationPayload>,
    ExcelConfigurationPayload
  >;
};

export function useAddExcelTemplateConfiguration({
  options = {},
}: AddExcelTemplateConfigurationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: excelTemplateKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddExcelTemplateConfigurationApiSuccessResponse>(
          EXCEL_TEMPLATE_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
