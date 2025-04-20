import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../../../queryKeysFactories/SalaryStructure";
import {
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "../../../../../../../../../../types/apiResponse";
import { type SalaryComponentAllocationsType } from "../../SalaryStructureRightModule";
import { type SalaryComponentAllocation } from "../../../../../CustomBasedSalaryStructure/Edit/hook/useEditCustomSalaryComponent";

export type SalaryStructureUpdatePayload = {
  salary_component_allocations: SalaryComponentAllocation[];
};

type SalaryStructureComponentUpdateSuccessResponse = ApiSuccessResponse<
  Omit<SalaryComponentAllocationsType, "selectedRows">
>;

type UseUpdateSalaryComponentArgs = {
  options: UseMutationOptions<
    SalaryStructureComponentUpdateSuccessResponse,
    ApiErrorResponse<Omit<SalaryComponentAllocationsType, "selectedRows">>,
    Omit<SalaryComponentAllocationsType, "selectedRows">
  >;
  salaryRangeId: string;
  ssId: string;
};

export const useUpdateSalaryComponent = ({
  options,
  salaryRangeId,
  ssId,
}: UseUpdateSalaryComponentArgs) => {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salaryStructureKeys.updateSalaryComponent(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<SalaryStructureComponentUpdateSuccessResponse>(
          SALARY_STRUCTURE_ROUTES.updateSalaryComponentList(
            ssId,
            salaryRangeId
          ),
          formValues
        );

      return data;
    },
    ...options,
  });
};
