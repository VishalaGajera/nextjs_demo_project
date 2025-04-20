import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { familyKeys } from "../../../../../../../../queryKeysFactories/family";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { FamilyDetailsFormFieldValues } from "../../Dialog/FamilyDetailsForm";
import { EMPLOYEE_FAMILY_DETAILS_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/family-details/routes";

type EditFamilyDetailsApiResponse = ApiSuccessResponse<null>;

type UseEditFamilyDetailsArgs = {
  options: UseMutationOptions<
    EditFamilyDetailsApiResponse,
    ApiErrorResponse<FamilyDetailsFormFieldValues>,
    Partial<FamilyDetailsFormFieldValues>
  >;
  familyDetailsId: string;
  employeeId: string;
};

export function useEditFamilyDetails({
  employeeId,
  familyDetailsId,
  options = {},
}: UseEditFamilyDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: familyKeys.edit(familyDetailsId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditFamilyDetailsApiResponse>(
        EMPLOYEE_FAMILY_DETAILS_ROUTES.patch(employeeId, familyDetailsId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
