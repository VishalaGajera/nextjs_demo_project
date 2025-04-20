import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../../../queryKeysFactories/SalaryStructure";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../../types/apiResponse";
import type { SalaryIntervals } from "../../Hooks/useGetSalaryRangeList";
import type { SalaryRangeFormType } from "../../SalaryRangeForm";

type EditSalaryRangeListApiSuccessResponse = ApiSuccessResponse<null>;

export type UseEditSalaryRangeListProps = {
  ssId: string;
  interval: SalaryIntervals;
  options: UseMutationOptions<
    EditSalaryRangeListApiSuccessResponse,
    ApiErrorResponse<SalaryRangeFormType>,
    Partial<SalaryRangeFormType>
  >;
};

export const useEditSalaryRange = ({
  interval,
  ssId,
  options,
}: UseEditSalaryRangeListProps) => {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salaryStructureKeys.editRangeList(ssId, interval),
    mutationFn: async (formData) => {
      const { data } = await axiosPrivate.patch(
        SALARY_STRUCTURE_ROUTES.editRangeList(ssId, interval),
        formData
      );

      return data;
    },
    ...options,
  });
};
