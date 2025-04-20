import { useQuery } from "@tanstack/react-query";
import { LWF_GROUP_ROUTES } from "../../../../../../../constants/routes/payroll/settings/contributions/lwf-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { labourWelfareFundKeys } from "../../../../../../../queryKeysFactories/labourWelfareFund";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { LabourWelfareFundFormValues } from "../../LabourWelfareFundForm/LabourWelfareFundForm";
import type { LabourWelfareFund } from "../../LabourWelfareFundListing/hooks/useListLabourWelfareFund";

type UseGetLabourWelfareFund = {
  lwfGroupId: LabourWelfareFund["id"];
};

export function useGetLabourWelfareFund({
  lwfGroupId,
}: UseGetLabourWelfareFund) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLabourWelfareFund = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LabourWelfareFundFormValues>>(
      LWF_GROUP_ROUTES.get(lwfGroupId)
    );

    return data;
  };

  return useQuery({
    queryKey: labourWelfareFundKeys.get(lwfGroupId),
    queryFn: fetchLabourWelfareFund,
    enabled: !!lwfGroupId,
  });
}
