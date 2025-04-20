import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import type { PageProps } from "../../../../../../../../app/employee-management/employee/[employeeId]/page";
import { useDialogActions } from "../../../../../../../../hooks/useDialogActions";
import { documentKeys } from "../../../../../../../../queryKeysFactories/document";
import type { ApiErrorResponse } from "../../../../../../../../types/apiResponse";
import type { DialogRenderer } from "../../../../../../../../types/dialogs";
import { useGetDocumentOptions } from "../../../../../../../common/Autocomplete/hooks/useGetDocumentOptions";
import { AddDocumentDialog } from "../../../../../AddEmployee/Document/Dialog/AddDocumentDialog";
import type { DocumentFormFieldValues } from "../../../../../AddEmployee/Document/Dialog/DocumentForm";
import { marshalDocumentPayload } from "../../../../../AddEmployee/MarshalEmployeeData";
import { useAddDocument } from "./Dialogs/hooks/useAddDocument";
import { DocumentList } from "./DocumentList/DocumentList";
import { employeeBasicDetailsKeys } from "../../../../../../../../queryKeysFactories/employee";

type DocumentCardProps = Readonly<PageProps["params"]>;

export type DocumentListRef = {
  refreshDocumentList: () => void;
};

export const Document = ({ employeeId }: DocumentCardProps) => {
  const documentListRef = useRef<DocumentListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const [documentErrors, setDocumentErrors] =
    useState<ApiErrorResponse<FieldValues> | null>(null);

  const queryClient = useQueryClient();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { data: documentOptions } = useGetDocumentOptions({
    employeeId,
  });

  const { mutate, isPending } = useAddDocument({
    employeeId,
    options: {
      onSuccess: (data) => {
        onDialogClose();

        documentListRef.current?.refreshDocumentList();

        queryClient.invalidateQueries({
          queryKey: documentKeys.options(employeeId),
        });

        queryClient.invalidateQueries({
          queryKey: employeeBasicDetailsKeys.get(employeeId),
        });

        queryClient.invalidateQueries({
          queryKey: documentKeys.listing({}),
        });

        toasts.success({ title: data.message });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: DocumentFormFieldValues = {
          ...(error && typeof error["document_details"] === "object"
            ? error["document_details"]
            : {}),
          ...{},
        };

        const structuredError = {
          response: {
            data: {
              message,
              error: formattedError,
            },
          },
          status: res.status,
        };

        setDocumentErrors(structuredError);
      },
    },
  });

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddDocumentDialog
        open
        loading={isPending}
        onClose={onDialogClose}
        documentErrors={documentErrors}
        onAdd={(formValues) => {
          const documentPayload = marshalDocumentPayload([formValues]);

          if (documentPayload[0]) {
            mutate(documentPayload[0]);
          }
        }}
        documentTypeOptions={documentOptions}
      />
    ),
  };

  return (
    <>
      <Box
        sx={{
          background: iron[600],
          border: `1px solid ${butterflyBlue[300]}`,
          borderRadius: "6px",
          height: "100%",
          width: "100%",
        }}
      >
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">Employee Documents</Typography>

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => onDialogOpen("add")}
            >
              Add Document
            </Button>
          </Stack>
        </PadBox>

        <DocumentList ref={documentListRef} employeeId={employeeId} />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
