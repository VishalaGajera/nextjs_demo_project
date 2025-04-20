"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { documentKeys } from "../../../../../../../../../../queryKeysFactories/document";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../../types/apiResponse";
import { EMPLOYEE_DOCUMENT_ROUTES } from "../../../../../../../../../../constants/routes/employee-management/employee/document/routes";

type DeleteDocumentApiResponse = ApiSuccessResponse<null>;

type UseDeleteDocumentArgs = {
  options: UseMutationOptions<DeleteDocumentApiResponse, ApiErrorResponse>;
  employeeId: string;
  documentId: string;
};

export function useDeleteDocument({
  employeeId,
  documentId,
  options = {},
}: UseDeleteDocumentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: documentKeys.delete(documentId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteDocumentApiResponse>(
        EMPLOYEE_DOCUMENT_ROUTES.delete(employeeId, documentId)
      );

      return data;
    },
    ...options,
  });
}
