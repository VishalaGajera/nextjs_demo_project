"use client";

import { toasts } from "@codezee/sixtify-brahma";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty, merge } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useApplicationContext } from "../../../../app/context/ApplicationContext";
import {
  DIRECTORY,
  LIST,
} from "../../../../app/employee-management/employee/hooks/constant";
import { employeeKeys } from "../../../../queryKeysFactories/employee";
import { onError } from "../../../../utils/errors";
import type { EmployeeFormFieldValues, FormRef } from "./EmployeeForm";
import { EmployeeForm, formDefaultValues } from "./EmployeeForm";
import { useAddEmployeeDraft } from "./hooks/useAddEmployeeDraft";

export const AddEmployee = () => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const {
    documentFormValues,
    setEmployeeFormValues,
    setDocumentFormValues,
    setIsOpenAddEditEmployeePage,
  } = useApplicationContext();

  const view = searchParams.get("view") === DIRECTORY ? DIRECTORY : LIST;

  const isDraft =
    searchParams.get("isDraft") === "true"
      ? Boolean(searchParams.get("isDraft"))
      : false;

  const { mutate, isPending } = useAddEmployeeDraft({
    options: {
      onSuccess: (data) => {
        if (!isEmpty(documentFormValues)) {
          setDocumentFormValues([]);
        }

        setEmployeeFormValues(formDefaultValues);

        setIsOpenAddEditEmployeePage(false);

        toasts.success({ title: data.message });

        queryClient.invalidateQueries({
          queryKey: employeeKeys.searchMetaData(),
        });

        router.push(
          `/employee-management/employee?view=${view}${isDraft ? "&isDraft=true" : ""}`
        );
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: EmployeeFormFieldValues = merge(
          error?.["basic_details"] ?? {},
          error?.["work_details"] ?? {},
          ...(error?.document_details
            ? [{ document_details: error.document_details }]
            : [])
        );

        const structuredError = {
          response: {
            data: {
              message,
              error: formattedError,
            },
          },
          status: res.status,
        };

        onError(structuredError, formRef.current?.setError, [
          { document_details: "Document is invalid" },
        ]);
      },
    },
  });

  const handleBackButton = useDebounceCallback(() => {
    if (!isEmpty(documentFormValues)) {
      setDocumentFormValues([]);
    }

    setEmployeeFormValues(formDefaultValues);

    setIsOpenAddEditEmployeePage(false);
  }, 100);

  useEffect(() => {
    return () => {
      handleBackButton();
    };
  }, []);

  return (
    <EmployeeForm
      ref={formRef}
      view={view}
      isDraft={isDraft}
      loading={isPending}
      onSaveDraftEmployee={(values) => mutate(values)}
    />
  );
};
