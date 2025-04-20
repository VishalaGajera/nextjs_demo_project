import { useQuery } from "@tanstack/react-query";
import { ADVANCE_AND_RECEIVE_ROUTES } from "../../../../../../constants/routes/payroll/payroll-transaction/advance-receive/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { advanceReceiveKeys } from "../../../../../../queryKeysFactories/advanceReceive";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { AdvanceAndReceive } from "../../AdvanceAndReceiveList/hooks/useGetAdvanceAndReceiveList";

type UseGetAdvanceAndReceiveArgs = {
  advanceAndReceiveId: AdvanceAndReceive["id"];
};

export function useGetAdvanceAndReceive({
  advanceAndReceiveId,
}: UseGetAdvanceAndReceiveArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchAdvanceAndReceive = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<AdvanceAndReceive>>(
      ADVANCE_AND_RECEIVE_ROUTES.get(advanceAndReceiveId)
    );

    return data;
  };

  return useQuery({
    queryKey: advanceReceiveKeys.get(advanceAndReceiveId),
    queryFn: fetchAdvanceAndReceive,
    enabled: !!advanceAndReceiveId,
  });
}
