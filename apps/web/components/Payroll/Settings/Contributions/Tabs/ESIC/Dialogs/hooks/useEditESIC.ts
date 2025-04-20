import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { ESIC_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/esic/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { esicKeys } from "../../../../../../../../queryKeysFactories/esic";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { ESICRecord } from "../../ESICList/hooks/useGetESICList";
import type { ESICFormFieldValues } from "../ESICForm";

type EditESICApiResponse = ApiSuccessResponse<ESICRecord>;

type UseEditESICArgs = {
  options: UseMutationOptions<
    EditESICApiResponse,
    ApiErrorResponse<ESICFormFieldValues>,
    Partial<ESICFormFieldValues>
  >;
  esicId: string;
};

export function useEditESIC({ esicId, options = {} }: UseEditESICArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: esicKeys.edit(esicId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditESICApiResponse>(
        ESIC_ROUTES.patch(esicId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
