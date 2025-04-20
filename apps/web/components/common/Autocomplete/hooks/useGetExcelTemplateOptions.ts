import { useQuery } from "@tanstack/react-query";
import {
  EXCEL_TEMPLATE_ROUTES,
  type QueryParams,
} from "../../../../constants/routes/settings/excel-template-configuration/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { excelTemplateKeys } from "../../../../queryKeysFactories/excelTemplate";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { MasterCodeOptionKeys } from "../../../settings/BulkDataManagement/DataUpload/ExcelImportProcess/ExcelDataPreview/constant";

type UseGetExcelTemplateOptions = {
  queryParams?: QueryParams;
};

export type Options = {
  label: string;
  value: string;
  master_name: string;
  master_code: MasterCodeOptionKeys;
  company_id: string | null;
  company_name: string | null;
};

export function useGetExcelTemplateOptionsQueryFn({
  queryParams,
}: UseGetExcelTemplateOptions) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchExcelTemplateOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<Options[]>>(
      EXCEL_TEMPLATE_ROUTES.options(queryParams)
    );

    return data.data;
  };

  return { fetchExcelTemplateOptions };
}
export function useGetExcelTemplateOptions(args?: UseGetExcelTemplateOptions) {
  const { queryParams = {} } = args ?? {};

  const { fetchExcelTemplateOptions } = useGetExcelTemplateOptionsQueryFn({
    queryParams,
  });

  return useQuery({
    queryKey: excelTemplateKeys.options(queryParams),
    queryFn: fetchExcelTemplateOptions,
    initialData: [],
  });
}
