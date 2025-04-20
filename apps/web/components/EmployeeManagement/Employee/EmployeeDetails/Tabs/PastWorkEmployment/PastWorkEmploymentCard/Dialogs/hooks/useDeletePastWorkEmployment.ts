"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { pastWorkEmploymentKeys } from "../../../../../../../../../queryKeysFactories/pastWorkEmployment";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import type { PastWorkEmployment } from "../../PastWorkEmploymentList/hooks/useGetPastWorkEmployments";
import { EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/past-work-employment/routes";

type DeletePastWorkEmploymentApiResponse =
  ApiSuccessResponse<PastWorkEmployment>;

type UseDeletePastWorkEmploymentArgs = {
  options: UseMutationOptions<
    DeletePastWorkEmploymentApiResponse,
    ApiErrorResponse
  >;
  pastWorkEmploymentId: string;
  employeeId: string;
};

export function useDeletePastWorkEmployment({
  pastWorkEmploymentId,
  employeeId,
  options = {},
}: UseDeletePastWorkEmploymentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: pastWorkEmploymentKeys.delete(pastWorkEmploymentId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeletePastWorkEmploymentApiResponse>(
          EMPLOYEE_PAST_WORK_EMPLOYMENT_ROUTES.delete(
            employeeId,
            pastWorkEmploymentId
          )
        );

      return data;
    },
    ...options,
  });
}
