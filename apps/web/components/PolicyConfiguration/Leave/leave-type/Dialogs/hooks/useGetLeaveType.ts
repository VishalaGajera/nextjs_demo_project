import { useQuery } from "@tanstack/react-query";

import { LEAVE_ROUTES } from "../../../../../../constants/routes/policy-configuration/leave/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveTypeKeys } from "../../../../../../queryKeysFactories/LeaveType";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { LeaveTypeFormFieldValues } from "../LeaveTypeForm";

type UseGetLeaveTypeArgs = {
  leaveTypeId: string;
};

export function useGetLeaveType({ leaveTypeId }: UseGetLeaveTypeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeaveType = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LeaveTypeFormFieldValues>>(
      LEAVE_ROUTES.get(leaveTypeId)
    );

    return data;
  };

  return useQuery({
    queryKey: leaveTypeKeys.get(leaveTypeId),
    queryFn: fetchLeaveType,
    enabled: !!leaveTypeId,
  });
}
