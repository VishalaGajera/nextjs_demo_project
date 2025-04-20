import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { EXCEL_TEMPLATE_ROUTES } from "../../../../../../constants/routes/settings/excel-template-configuration/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { excelTemplateKeys } from "../../../../../../queryKeysFactories/excelTemplate";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

type ExcelTemplateFields = {
  id: string;
  template_field_name: string;
};

export type ExcelTemplate = {
  id: string;
  template_name: string;
  excel_master_id: string;
  excel_template_fields: ExcelTemplateFields[];
  master_name: string;
  company_id: string;
  company_name: string;
  is_active: boolean;
  action_by: string;
  action_at: string;
  full_count: string;
};

type ExcelTemplatesBody = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetExcelTemplatesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getExcelTemplates = async ({ body }: ExcelTemplatesBody) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        excelTemplates: ExcelTemplate[];
        totalCount: number;
      }>
    >(EXCEL_TEMPLATE_ROUTES.listing, body);

    return data.data;
  };

  return { getExcelTemplates };
}

export function useGetExcelTemplates({ body }: ExcelTemplatesBody) {
  const { getExcelTemplates } = useGetExcelTemplatesQueryFn();

  return useQuery({
    queryKey: excelTemplateKeys.listing(body),
    queryFn: () => getExcelTemplates({ body }),
    initialData: { excelTemplates: [], totalCount: 0 },
  });
}
