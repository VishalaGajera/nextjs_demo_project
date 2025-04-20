import { useQuery } from "@tanstack/react-query";
import { ESIC_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/esic/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { esicKeys } from "../../../../../../../../queryKeysFactories/esic";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { ESICRecord } from "../../ESICList/hooks/useGetESICList";
import type { ESICFormFieldValues } from "../ESICForm";

type UseGetESICArgs = {
  esicId: ESICRecord["id"];
};

export function useGetESIC({ esicId }: UseGetESICArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchESIC = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<ESICFormFieldValues>>(
      ESIC_ROUTES.get(esicId)
    );

    return data;
  };

  return useQuery({
    queryKey: esicKeys.get(esicId),
    queryFn: fetchESIC,
    enabled: !!esicId,
  });
}
