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
import type { ExcelConfigurationPayload } from "./useAddExcelTemplateConfiguration";

type EditExcelTemplateConfigurationApiResponse = ApiSuccessResponse<{
  message: string;
  data: null;
}>;

type UseEditExcelTemplateConfigurationArgs = {
  options: UseMutationOptions<
    EditExcelTemplateConfigurationApiResponse,
    ApiErrorResponse<ExcelConfigurationPayload>,
    ExcelConfigurationPayload
  >;
  excelTemplateId: string;
};

export function useEditExcelTemplateConfiguration({
  excelTemplateId,
  options = {},
}: UseEditExcelTemplateConfigurationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: excelTemplateKeys.edit(excelTemplateId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditExcelTemplateConfigurationApiResponse>(
          EXCEL_TEMPLATE_ROUTES.patch(excelTemplateId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
