"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { documentKeys } from "../../../../../../../../../../queryKeysFactories/document";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../../types/apiResponse";
import type { DocumentFormFieldValues } from "../../../../../../../AddEmployee/Document/Dialog/DocumentForm";
import { EMPLOYEE_DOCUMENT_ROUTES } from "../../../../../../../../../../constants/routes/employee-management/employee/document/routes";

type EditDocumentApiResponse = ApiSuccessResponse<null>;

type EditDocumentPayload = {
  document_type: DocumentFormFieldValues["document_type"];
  document_details: Partial<
    Omit<DocumentFormFieldValues, "cgpa_or_percentage">
  > & {
    cgpa_or_percentage?: string | null; // Override the type here
  };
};

type UseEditDocumentArgs = {
  options: UseMutationOptions<
    EditDocumentApiResponse,
    ApiErrorResponse<Record<string, string>>,
    EditDocumentPayload
  >;
  documentId: string;
  employeeId: string;
};

export function useEditDocument({
  employeeId,
  documentId,
  options = {},
}: UseEditDocumentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: documentKeys.edit(documentId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditDocumentApiResponse>(
        EMPLOYEE_DOCUMENT_ROUTES.patch(employeeId, documentId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
