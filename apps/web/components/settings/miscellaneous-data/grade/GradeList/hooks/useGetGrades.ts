import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { gradeKeys } from "../../../../../../queryKeysFactories/grade";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { GRADE_ROUTES } from "../../../../../../constants/routes/settings/grade/routes";

export type Grade = {
  id: string;
  company_id: string;
  grade_code: string;
  grade_name: string;
  description: string;
  is_active: boolean;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetGradesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetGradesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getGrades = async ({ body }: GetGradesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        grades: Grade[];
        totalCount: number;
      }>
    >(GRADE_ROUTES.listing, body);

    return data.data;
  };

  return { getGrades };
}

export function useGetGrades({ body }: GetGradesArgs) {
  const { getGrades } = useGetGradesQueryFn();

  return useQuery({
    queryKey: gradeKeys.listing(body),
    queryFn: () => getGrades({ body }),
    initialData: { grades: [], totalCount: 0 },
  });
}
