import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import type { QuickFilter } from "../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";

export type EmployeeData = {
  employee_code: string;
  employee_id: string;
  employee_name: string;
};

type GetEmployeesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        customFilter: {
          isDraft?: boolean;
        };
      }>;
  section: string;
  sectionId: string;
};

export function useGetSectionEmployee() {
  const { axiosPrivate } = useAxiosPrivate();

  const getEmployees = async ({
    body,
    section,
    sectionId,
  }: GetEmployeesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        employees: EmployeeData[];
        totalCount: number;
      }>
    >(`api/settings/${section}/${sectionId}/employee/list`, body);

    return data.data;
  };

  return { getEmployees };
}
