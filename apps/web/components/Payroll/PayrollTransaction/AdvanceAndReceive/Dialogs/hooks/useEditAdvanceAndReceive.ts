import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { ADVANCE_AND_RECEIVE_ROUTES } from "../../../../../../constants/routes/payroll/payroll-transaction/advance-receive/route";
import { advanceReceiveKeys } from "../../../../../../queryKeysFactories/advanceReceive";

import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { AdvanceAndReceive } from "../../AdvanceAndReceiveList/hooks/useGetAdvanceAndReceiveList";
import type { AdvanceAndReceiveFormFieldValues } from "../AddAdvanceAndReceiveForm";

type EditAdvanceAndReceiveApiResponse = ApiSuccessResponse<AdvanceAndReceive>;

type UseEditAdvanceAndReceiveArgs = {
  options: UseMutationOptions<
    EditAdvanceAndReceiveApiResponse,
    ApiErrorResponse<AdvanceAndReceiveFormFieldValues>,
    Partial<AdvanceAndReceiveFormFieldValues>
  >;
  advanceAndReceiveId: string;
};

export function useEditAdvanceAndReceive({
  advanceAndReceiveId,
  options = {},
}: UseEditAdvanceAndReceiveArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: advanceReceiveKeys.edit(advanceAndReceiveId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditAdvanceAndReceiveApiResponse>(
          ADVANCE_AND_RECEIVE_ROUTES.patch(advanceAndReceiveId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
