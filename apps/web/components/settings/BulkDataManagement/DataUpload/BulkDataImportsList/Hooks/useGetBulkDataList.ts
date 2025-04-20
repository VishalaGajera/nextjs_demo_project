import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { BULK_DATA_UPLOAD_ROUTES } from "../../../../../../constants/routes/settings/bulk-data-management/data-upload/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bulkDataUploadKeys } from "../../../../../../queryKeysFactories/bulkDataUpload";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type DataImportType = {
  id: string;
  import_log: string;
  template_name: string;
  master_name: string;
  company_name: string | null;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetBulkDataListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetBulkDataListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getBulkDataList = async ({ body }: GetBulkDataListArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        dataImports: DataImportType[];
        totalCount: number;
      }>
    >(BULK_DATA_UPLOAD_ROUTES.listing, body);

    return data.data;
  };

  return { getBulkDataList };
}

export function useGetBulkDataList({ body }: GetBulkDataListArgs) {
  const { getBulkDataList } = useGetBulkDataListQueryFn();

  return useQuery({
    queryKey: bulkDataUploadKeys.listing(body),
    queryFn: () => getBulkDataList({ body }),
    initialData: { dataImports: [], totalCount: 0 },
  });
}
