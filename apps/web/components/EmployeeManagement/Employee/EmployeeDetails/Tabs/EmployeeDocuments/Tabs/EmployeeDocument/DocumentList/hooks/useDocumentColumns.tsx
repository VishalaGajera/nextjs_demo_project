import {
  ActionCell,
  LoadingCell,
  Chip,
  Tooltip,
} from "@codezee/sixtify-brahma";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../../../types/dialogs";
import {
  AADHAAR_CARD,
  PAN_CARD,
} from "../../../../../../../AddEmployee/Document/Dialog/hooks/constant";
import {
  DocumentOptions,
  type DocumentOptionKey,
} from "../../../../../../../AddEmployee/Document/Dialog/hooks/useDocumentOptions";
import type { Document } from "./useGetDocuments";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";
import { alpha, Box, Stack, Typography } from "@mui/material";
import { dateFormat } from "../../../../../../../../../../utils/date";
import { APPROVE } from "../../../../../../../../../common/Autocomplete/hooks/constant";
import { getColorByVariant } from "../../../../../../../../../Transactions/Leave/LeaveOverview/LeaveDetails/LeaveBalance/colorVariant";
import { capitalize } from "lodash";

type UseDocumentColumns = {
  onAction: (actionType: DialogTypes, rowData: Document) => void;
  documentList: { documents: Document[]; totalCount: number };
};

export const useDocumentColumns = ({
  onAction,
  loading,
  documentList,
}: AgColumnsArgs<UseDocumentColumns>) => {
  const column: AgColumnsWithActions<Document> = [
    {
      headerName: "Document Type",
      field: "document_type",
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          data.document_type &&
          DocumentOptions[data.document_type as DocumentOptionKey]
        );
      },
      sortable: true,
    },
    {
      headerName: "Document No",
      field: "document_no",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? " -";
      },
    },
    {
      headerName: "Name As Per Document",
      field: "name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? " -";
      },
    },
    {
      headerName: "Status",
      field: "verification_status",
      sortable: true,
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Chip
            label={value ? capitalize(value) : "-"}
            sx={{
              width: "fit-content",
              color: getColorByVariant(value),
              backgroundColor: alpha(
                getColorByVariant(value) ?? "transparent",
                0.2
              ),
            }}
          />
        );
      },
    },
    {
      headerName: "Action By & Date",
      field: "verified_by",
      cellRenderer: ({ data }: CustomCellRendererProps<Document>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Box>
            <Typography variant="body2">{data.verified_by}</Typography>

            <Typography variant="body2">
              {data.verified_at ? dateFormat(data.verified_at) : "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 100,
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<Document>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const documents = documentList?.documents || [];

        const isExistingDocument = documents.some(
          (doc) =>
            doc.document_type === data.document_type && doc.id !== data.id
        );

        const items = isExistingDocument
          ? // eslint-disable-next-line sonarjs/no-nested-conditional
            data.verification_status === "approved"
            ? [{ title: "View", onClick: () => onAction("view", data) }]
            : [
                { title: "View", onClick: () => onAction("view", data) },
                { title: "Edit", onClick: () => onAction("edit", data) },
              ]
          : [
              { title: "View", onClick: () => onAction("view", data) },
              { title: "Edit", onClick: () => onAction("edit", data) },
              ...(![AADHAAR_CARD, PAN_CARD].includes(data.document_type)
                ? [{ title: "Delete", onClick: () => onAction("delete", data) }]
                : []),
            ];

        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            width="90%"
            gap="5px"
          >
            {data.verification_status !== "approved" && (
              <Tooltip toolTipLabel="Verify Document">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <CheckCircleOutlineOutlined
                    fontSize="medium"
                    color="success"
                    style={{ cursor: "pointer", width: "40px" }}
                    onClick={() => onAction && onAction(APPROVE, data)}
                  />
                </Box>
              </Tooltip>
            )}

            <Box width="20px">
              <ActionCell items={items}></ActionCell>
            </Box>
          </Stack>
        );
      },
    },
  ];

  return { column };
};
