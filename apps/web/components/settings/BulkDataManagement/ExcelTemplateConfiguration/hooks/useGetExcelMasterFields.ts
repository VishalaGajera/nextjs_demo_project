import { useQuery } from "@tanstack/react-query";
import { EXCEL_MASTER_ROUTES } from "../../../../../constants/routes/settings/excel-template-configuration/excel-master/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { excelMasterKeys } from "../../../../../queryKeysFactories/excelMaster";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

type UseGetDepartmentArgs = {
  excelMasterId: string;
};

type ExcelMasterField = {
  id: string;
  field_name: string;
  required: boolean;
  parent_reference: string | null;
};

export function useGetExcelMasterFields({
  excelMasterId,
}: UseGetDepartmentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchExcelMasterFields = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<ExcelMasterField[]>
    >(EXCEL_MASTER_ROUTES.get(excelMasterId));

    return data.data;
  };

  return useQuery({
    queryKey: excelMasterKeys.get(excelMasterId),
    queryFn: fetchExcelMasterFields,
    enabled: !!excelMasterId,
    initialData: [],
  });
}
