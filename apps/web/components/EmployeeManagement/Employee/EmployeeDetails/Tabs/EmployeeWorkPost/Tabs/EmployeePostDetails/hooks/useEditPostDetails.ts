"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeePostDetails } from "../../../../../../../../../queryKeysFactories/employeePostDetails";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import type { OptionKey } from "../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import { EMPLOYEE_POST_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/post-details/routes";

type PostDetailEditResponse = object;

type EditPostDetailArgsApiResponse = ApiSuccessResponse<PostDetailEditResponse>;

type EditDataPayload = Partial<{
  id: string | null;
  effective_from: string | null;
  remark: string | null;
}>;

export type EditDepartmentPayload = Partial<{
  department: EditDataPayload;
  sub_department: EditDataPayload;
  designation: EditDataPayload;
  grade: EditDataPayload;
  work_type: EditDataPayload;
  skill_type: EditDataPayload;
}>;

type UseEditPostDetailArgs = {
  options: UseMutationOptions<
    EditPostDetailArgsApiResponse,
    ApiErrorResponse<EditDepartmentPayload>,
    Partial<EditDepartmentPayload>
  >;
  employeeId: string;
  operationType: OptionKey;
};

export function useEditPostDetails({
  employeeId,
  operationType,
  options = {},
}: UseEditPostDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeePostDetails.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditPostDetailArgsApiResponse>(
        EMPLOYEE_POST_DETAILS_ROUTES.patch(employeeId, operationType),
        formValues
      );

      return data;
    },
    ...options,
  });
}
