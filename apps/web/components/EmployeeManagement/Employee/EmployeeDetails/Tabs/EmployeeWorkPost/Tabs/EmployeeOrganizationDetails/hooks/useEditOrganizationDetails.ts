"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";
import type { OptionKey } from "../BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import { employeeOrganizationDetails } from "../../../../../../../../../queryKeysFactories/employeeOrganizationDetails";
import { EMPLOYEE_ORGANIZATION_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/organization-details/routes";

type OrganizationDetailEditResponseData = object;

type EditOrganizationDetailApiResponse =
  ApiSuccessResponse<OrganizationDetailEditResponseData>;

export type EditOrganizationDetailPayload = Partial<{
  business_unit: Partial<{
    id: string | null;
    effective_from: string | null;
    remark: string | null;
  }>;
  business_unit_location: Partial<{
    id: string | null;
    effective_from: string | null;
    remark: string | null;
  }>;
  reporting_manager: Partial<{
    id: string | null;
    effective_from: string | null;
    remark: string | null;
  }>;
}>;

type UseEditOrganizationDetailsArgs = {
  options: UseMutationOptions<
    EditOrganizationDetailApiResponse,
    ApiErrorResponse<EditOrganizationDetailPayload>,
    Partial<EditOrganizationDetailPayload>
  >;
  employeeId: string;
  operationType: OptionKey;
};

export function useEditOrganizationDetails({
  employeeId,
  operationType,
  options = {},
}: UseEditOrganizationDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeOrganizationDetails.edit(employeeId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditOrganizationDetailApiResponse>(
          EMPLOYEE_ORGANIZATION_DETAILS_ROUTES.patch(employeeId, operationType),
          formValues
        );

      return data;
    },
    ...options,
  });
}
