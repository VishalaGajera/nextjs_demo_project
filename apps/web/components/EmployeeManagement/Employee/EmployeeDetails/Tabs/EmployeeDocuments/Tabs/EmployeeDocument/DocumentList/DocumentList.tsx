import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import {
  type ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { PageProps } from "../../../../../../../../../app/employee-management/employee/[employeeId]/page";
import { useDialogActions } from "../../../../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../../../../types/dialogs";

import { useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "../../../../../../../../../queryKeysFactories/document";
import { DeleteDocumentDialog } from "../Dialogs/DeleteDocumentDialog";
import { EditDocumentDialog } from "../Dialogs/EditDocumentDialog";
import { RejectDocumentDialog } from "../Dialogs/RejectDocumentDialog";
import { VerifyDocumentDialog } from "../Dialogs/VerifyDocumentDialog";
import { ViewDocumentDialog } from "../Dialogs/ViewDocumentDialog";
import type { DocumentListRef } from "../Document";
import { useDocumentColumns } from "./hooks/useDocumentColumns";
import type { Document } from "./hooks/useGetDocuments";
import { useDocumentsQueryFn, useGetDocuments } from "./hooks/useGetDocuments";
type DocumentListProps = Readonly<PageProps["params"]>;

export const DocumentList = forwardRef(
  ({ employeeId }: DocumentListProps, ref: ForwardedRef<DocumentListRef>) => {
    const gridRef = useRef<AgGridReact<Document>>(null);

    const queryClient = useQueryClient();

    const [currentDocument, setCurrentDocument] = useState<Document>();

    const [loading, setLoading] = useState(false);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const { data: documentList } = useGetDocuments({
      employeeId,
      body: {},
    });

    const { column } = useDocumentColumns({
      onAction: (actionType, document) => {
        onDialogOpen(actionType);
        setCurrentDocument(document);
      },
      loading,
      documentList: documentList || { documents: [], totalCount: 0 },
    });

    const { getDocuments } = useDocumentsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { startRow, endRow, sortModel } = params;

      const { documents, totalCount } = await getDocuments({
        employeeId,
        body: {
          startRow,
          endRow,
          sortModel,
        },
      });

      let lastRow = -1;

      if (documents.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (documents.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(documents, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<Document>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => ({
      refreshDocumentList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentDocument && (
        <EditDocumentDialog
          open
          employeeId={employeeId}
          onClose={onDialogClose}
          document={currentDocument}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentDocument && (
        <DeleteDocumentDialog
          open
          employeeId={employeeId}
          onClose={onDialogClose}
          document={currentDocument}
          onDeleteSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: documentKeys.options(currentDocument.employee_id),
            });

            refreshCache();
          }}
        />
      ),
      view: currentDocument && (
        <ViewDocumentDialog
          open
          onClose={onDialogClose}
          document={currentDocument}
        />
      ),
      approve: currentDocument && (
        <VerifyDocumentDialog
          open
          onClose={onDialogClose}
          onDialogOpen={onDialogOpen}
          document={currentDocument}
          employeeId={employeeId}
          onEditSuccess={refreshCache}
        />
      ),
      reject: currentDocument && (
        <RejectDocumentDialog
          open
          onClose={onDialogClose}
          document={currentDocument}
          employeeId={employeeId}
          onEditSuccess={refreshCache}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<Document>
          ref={gridRef}
          columnDefs={column}
          onGridReady={onGridReady}
          rowModelType="clientSide"
          rowData={documentList?.documents || []}
          height="calc(63vh - 270px)"
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

DocumentList.displayName = "DocumentList";
