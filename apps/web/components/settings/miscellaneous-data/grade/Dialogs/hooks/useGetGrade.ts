import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { gradeKeys } from "../../../../../../queryKeysFactories/grade";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { Grade } from "../../GradeList/hooks/useGetGrades";
import { GRADE_ROUTES } from "../../../../../../constants/routes/settings/grade/routes";

type UseGetGradeArgs = {
  gradeId: Grade["id"];
};

export function useGetGrade({ gradeId }: UseGetGradeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchGrade = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<Grade>>(
      GRADE_ROUTES.get(gradeId)
    );

    return data;
  };

  return useQuery({
    queryKey: gradeKeys.get(gradeId),
    queryFn: fetchGrade,
    enabled: !!gradeId,
  });
}
