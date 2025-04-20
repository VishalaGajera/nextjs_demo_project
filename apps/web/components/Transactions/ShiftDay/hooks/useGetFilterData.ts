import { useQueries } from "@tanstack/react-query";
import { businessUnitsKeys } from "../../../../queryKeysFactories/businessUnit";
import { departmentKeys } from "../../../../queryKeysFactories/department";
import { designationKeys } from "../../../../queryKeysFactories/designation";
import { employeeKeys } from "../../../../queryKeysFactories/employee";
import { useGetBusinessUnitOptionsQueryFn } from "../../../common/Autocomplete/hooks/useGetBusinessUnitOptions";
import { useGetDepartmentOptionsQueryFn } from "../../../common/Autocomplete/hooks/useGetDepartmentOptions";
import { useGetDesignationOptionsQueryFn } from "../../../common/Autocomplete/hooks/useGetdesignationsOptions";
import { useGetEmployeeOptionsQueryFn } from "../../../common/Autocomplete/hooks/useGetEmployeeOption";

type UseGetFilterDataArgs = {
  companyId: string;
};

export function useGetFilterData({ companyId }: UseGetFilterDataArgs) {
  const { fetchBusinessUnit } = useGetBusinessUnitOptionsQueryFn({ companyId });

  const { fetchDepartment } = useGetDepartmentOptionsQueryFn({ companyId });

  const { fetchDesignation } = useGetDesignationOptionsQueryFn({ companyId });

  const { fetchEmployeeOption } = useGetEmployeeOptionsQueryFn({
    companyId,
    queryParams: {
      avatar: true,
    },
  });

  const queries = useQueries({
    queries: [
      {
        queryKey: businessUnitsKeys.options(companyId),
        queryFn: fetchBusinessUnit,
        initialData: [],
      },
      {
        queryKey: departmentKeys.options(companyId),
        queryFn: fetchDepartment,
        enabled: !!companyId,
        initialData: [],
      },
      {
        queryKey: designationKeys.options(companyId),
        queryFn: fetchDesignation,
        enabled: !!companyId,
        initialData: [],
      },
      {
        queryKey: employeeKeys.options(companyId, { avatar: true }),
        queryFn: fetchEmployeeOption,
        enabled: !!companyId,
        initialData: [],
      },
    ],
  });

  return {
    businessUnitOptions: queries[0].data,
    departmentOptions: queries[1].data,
    designationsOptions: queries[2].data,
    reportingMemberOptions: queries[3].data,
  };
}
