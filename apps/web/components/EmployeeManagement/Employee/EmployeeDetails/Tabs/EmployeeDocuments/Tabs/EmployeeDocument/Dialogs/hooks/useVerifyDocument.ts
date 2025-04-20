"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../../types/apiResponse";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { documentKeys } from "../../../../../../../../../../queryKeysFactories/document";
import { EMPLOYEE_DOCUMENT_ROUTES } from "../../../../../../../../../../constants/routes/employee-management/employee/document/routes";

type VerifytDocumentApiResponse = ApiSuccessResponse<null>;

type VerifyDocumentPayload = {
  verification_status?: string;
  verification_remark?: string;
};

type UseVerifyDocumentArgs = {
  options: UseMutationOptions<
    VerifytDocumentApiResponse,
    ApiErrorResponse<Record<string, string>>,
    VerifyDocumentPayload
  >;
  documentId: string;
  employeeId: string;
};

export function useVerifyDocument({
  employeeId,
  documentId,
  options = {},
}: UseVerifyDocumentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: documentKeys.verify(employeeId, documentId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<VerifytDocumentApiResponse>(
        EMPLOYEE_DOCUMENT_ROUTES.verify(employeeId, documentId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
