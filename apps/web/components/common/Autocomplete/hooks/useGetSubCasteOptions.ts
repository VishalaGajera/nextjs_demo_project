import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { subCasteKeys } from "../../../../queryKeysFactories/subCaste";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { SUB_CASTE_ROUTES } from "../../../../constants/routes/settings/sub-caste/routes";

type UseGetSubCasteArgs = {
  employeeId: string;
  castValue: string;
};

export function useGetSubCasteOptions({
  employeeId,
  castValue,
}: UseGetSubCasteArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSubCaste = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      SUB_CASTE_ROUTES.options(castValue, employeeId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: subCasteKeys.options(castValue),
    queryFn: fetchSubCaste,
    enabled: !!employeeId && !!castValue,
    initialData: [],
  });
}
