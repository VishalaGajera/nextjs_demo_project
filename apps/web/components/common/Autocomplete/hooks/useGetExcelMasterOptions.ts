import { useQuery } from "@tanstack/react-query";
import { EXCEL_MASTER_ROUTES } from "../../../../constants/routes/settings/excel-template-configuration/excel-master/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { excelMasterKeys } from "../../../../queryKeysFactories/excelMaster";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";

type Options = {
  value: string;
  label: string;
  master_code: string;
  is_company_required: boolean;
};

export function useGetExcelMasterOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchExcelMaster = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<Options[]>>(
      EXCEL_MASTER_ROUTES.options()
    );

    return data.data;
  };

  return useQuery({
    queryKey: excelMasterKeys.options(),
    queryFn: fetchExcelMaster,
    initialData: [],
  });
}
