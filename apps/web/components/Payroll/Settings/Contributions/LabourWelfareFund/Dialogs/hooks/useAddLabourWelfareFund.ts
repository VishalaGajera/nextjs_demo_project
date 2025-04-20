import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { LWF_GROUP_ROUTES_BASE_URL } from "../../../../../../../constants/routes/payroll/settings/contributions/lwf-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { labourWelfareFundKeys } from "../../../../../../../queryKeysFactories/labourWelfareFund";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { LabourWelfareFundFormValues } from "../../LabourWelfareFundForm/LabourWelfareFundForm";

type AddLabourWelfareFundApiSuccessResponse = ApiSuccessResponse<{
  data: string;
  message: string;
}>;

type UseAddOvertimeRulesArgs = {
  options: UseMutationOptions<
    AddLabourWelfareFundApiSuccessResponse,
    ApiErrorResponse<LabourWelfareFundFormValues>,
    Partial<LabourWelfareFundFormValues>
  >;
};

export function useAddLabourWelfareFund({
  options = {},
}: UseAddOvertimeRulesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: labourWelfareFundKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddLabourWelfareFundApiSuccessResponse>(
          LWF_GROUP_ROUTES_BASE_URL,
          formValues
        );

      return data;
    },
    ...options,
  });
}
