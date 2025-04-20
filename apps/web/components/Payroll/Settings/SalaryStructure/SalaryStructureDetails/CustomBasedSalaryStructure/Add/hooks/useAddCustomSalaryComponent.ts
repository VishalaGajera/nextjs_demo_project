import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../queryKeysFactories/SalaryStructure";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { CustomSalaryComponentAllocationsType } from "../AddCustomBasedSalaryStructure";

type AddCustomSalaryComponentPayload = Omit<
  CustomSalaryComponentAllocationsType,
  "selectedRows"
>;

type AddCustomSalaryComponentPayloadSuccessResponse =
  ApiSuccessResponse<AddCustomSalaryComponentPayload>;

type UseAddSalaryComponentArgs = {
  options: UseMutationOptions<
    AddCustomSalaryComponentPayloadSuccessResponse,
    ApiErrorResponse<AddCustomSalaryComponentPayload>,
    Partial<AddCustomSalaryComponentPayload>
  >;
  ssId: string;
};

export const useAddCustomSalaryComponent = ({
  options,
  ssId,
}: UseAddSalaryComponentArgs) => {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salaryStructureKeys.addCustomSalaryComponent(ssId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddCustomSalaryComponentPayloadSuccessResponse>(
          SALARY_STRUCTURE_ROUTES.addSalaryCustomComponentList(ssId),
          formValues
        );

      return data;
    },
    ...options,
  });
};
