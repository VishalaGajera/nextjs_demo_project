import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { subCasteKeys } from "../../../../../../queryKeysFactories/subCaste";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { SubCaste } from "../../SubCasteList/hooks/useGetSubCastes";
import { SUB_CASTE_ROUTES } from "../../../../../../constants/routes/settings/sub-caste/routes";

type UseGetSubCasteArgs = {
  subCasteId: SubCaste["id"];
};

export function useGetSubCaste({ subCasteId }: UseGetSubCasteArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSubCaste = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<SubCaste>>(
      SUB_CASTE_ROUTES.get(subCasteId)
    );

    return data;
  };

  return useQuery({
    queryKey: subCasteKeys.get(subCasteId),
    queryFn: fetchSubCaste,
    enabled: !!subCasteId,
  });
}
