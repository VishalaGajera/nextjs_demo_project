import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { gradeKeys } from "../../../../queryKeysFactories/grade";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { GRADE_ROUTES } from "../../../../constants/routes/settings/grade/routes";

type UseGetGradeArgs = {
  companyId: string;
};

export function useGetGradeOptions({ companyId }: UseGetGradeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchGrade = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      GRADE_ROUTES.options(companyId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: gradeKeys.options(companyId),
    queryFn: fetchGrade,
    enabled: !!companyId,
    initialData: [],
  });
}
