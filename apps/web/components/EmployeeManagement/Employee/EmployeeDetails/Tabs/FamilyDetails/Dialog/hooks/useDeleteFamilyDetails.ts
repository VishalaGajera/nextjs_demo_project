"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { familyKeys } from "../../../../../../../../queryKeysFactories/family";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import { EMPLOYEE_FAMILY_DETAILS_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/family-details/routes";

type DeleteFamilyDetailsApiResponse = ApiSuccessResponse<null>;

type UseDeleteFamilyDetailsArgs = {
  options: UseMutationOptions<DeleteFamilyDetailsApiResponse, ApiErrorResponse>;
  familyId: string;
  employeeId: string;
};

export function useDeleteFamilyDetails({
  familyId,
  employeeId,
  options = {},
}: UseDeleteFamilyDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: familyKeys.delete(familyId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteFamilyDetailsApiResponse>(
          EMPLOYEE_FAMILY_DETAILS_ROUTES.delete(employeeId, familyId)
        );

      return data;
    },
    ...options,
  });
}
