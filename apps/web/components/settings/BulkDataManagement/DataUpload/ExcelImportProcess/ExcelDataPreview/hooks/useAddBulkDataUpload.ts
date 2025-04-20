"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { BULK_DATA_UPLOAD_ROUTES } from "../../../../../../../constants/routes/settings/bulk-data-management/data-upload/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { bulkDataUploadKeys } from "../../../../../../../queryKeysFactories/bulkDataUpload";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";

type BulkDataUpload = {
  id: string;
  import_log: string;
  template_name: string;
  master_name: string;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type AddBulkDataUploadApiSuccessResponse = ApiSuccessResponse<BulkDataUpload>;

export type AddBulkDataUploadApiPayload = {
  bulk_data: Partial<Record<string, unknown>[]>;
};

export type AddBulkDataUploadApiError = {
  bulk_data: Record<string, string>[];
};

type UseAddBulkDataUploadArgs = {
  options: UseMutationOptions<
    AddBulkDataUploadApiSuccessResponse,
    ApiErrorResponse<AddBulkDataUploadApiError>,
    AddBulkDataUploadApiPayload
  >;

  excelTemplateId: string;
  masterCode: string;
};

export function useAddBulkDataUpload({
  excelTemplateId,
  masterCode,
  options = {},
}: UseAddBulkDataUploadArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bulkDataUploadKeys.add(excelTemplateId, masterCode),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddBulkDataUploadApiSuccessResponse>(
          BULK_DATA_UPLOAD_ROUTES.post(excelTemplateId, masterCode),
          formValues
        );

      return data;
    },
    ...options,
  });
}
