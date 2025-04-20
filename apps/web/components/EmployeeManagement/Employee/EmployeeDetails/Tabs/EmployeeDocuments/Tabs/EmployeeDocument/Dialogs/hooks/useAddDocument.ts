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

type AddDocumentApiSuccessResponse = ApiSuccessResponse<null>;

type AddDocumentPayload = {
  document_type: DocumentFormFieldValues["document_type"];
  document_details: Partial<
    Omit<DocumentFormFieldValues, "cgpa_or_percentage">
  > & {
    cgpa_or_percentage?: string | null; // Override the type here
  };
};

type UseAddDocumentArgs = {
  options: UseMutationOptions<
    AddDocumentApiSuccessResponse,
    ApiErrorResponse<Record<string, string>>,
    AddDocumentPayload
  >;
  employeeId: string;
};

export function useAddDocument({
  options = {},
  employeeId,
}: UseAddDocumentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: documentKeys.add(employeeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddDocumentApiSuccessResponse>(
        EMPLOYEE_DOCUMENT_ROUTES.post(employeeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
