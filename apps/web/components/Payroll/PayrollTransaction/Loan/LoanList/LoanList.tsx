import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import {
  type ForwardedRef,
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { FieldValues } from "react-hook-form";
import type { LoanListRef } from "../../../../../app/payroll/payroll-transaction/loan/page";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { ApproveLoanDialog } from "../Dialogs/ApproveLoanDialog";
import { CancelLoanDialog } from "../Dialogs/CancelLoanDialog";
import { DeleteLoanDialog } from "../Dialogs/DeleteLoanDialog";
import { RejectLoanDialog } from "../Dialogs/RejectLoanDialog";
import {
  type LoanListType,
  useGetLoanListQueryFn,
} from "./hooks/useGetLoanList";
import { useLoanColumns } from "./hooks/useLoanColumns";
export type LoanListProps = {
  search?: string | null;
  externalFilter?: FieldValues;
};

export const LoanList = forwardRef(
  (
    { search = null, externalFilter }: LoanListProps,
    ref: ForwardedRef<LoanListRef>
  ) => {
    const router = useRouter();

    const gridRef = useRef<AgGridReact<LoanListType>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentLoan, setCurrentLoan] = useState<LoanListType>();

    const [loading, setLoading] = useState(false);

    const { columns } = useLoanColumns({
      onAction: (actionType, loan) => {
        if (actionType === "edit") {
          router.push(`/payroll/payroll-transaction/loan/${loan.id}`);
        } else {
          onDialogOpen(actionType);
        }
        setCurrentLoan(loan);
      },
      loading,
    });

    const { getLoanList } = useGetLoanListQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { loans, totalCount } = await getLoanList({
        body: {
          ...params,
          externalFilter,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (loans.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (loans.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(loans, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useImperativeHandle(ref, () => ({
      refreshLoanList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search, externalFilter]);

    const dialogRenderer: DialogRenderer = {
      delete: currentLoan && (
        <DeleteLoanDialog
          open
          loan={currentLoan}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),

      approve: currentLoan && (
        <ApproveLoanDialog
          open
          onClose={onDialogClose}
          onApproveSuccess={refreshCache}
          loanDetails={currentLoan}
        />
      ),

      reject: currentLoan && (
        <RejectLoanDialog
          open
          onClose={onDialogClose}
          onRejectSuccess={refreshCache}
          loanDetails={currentLoan}
        />
      ),

      cancel: currentLoan && (
        <CancelLoanDialog
          open
          onClose={onDialogClose}
          onCancelSuccess={refreshCache}
          loanDetails={currentLoan}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <Fragment>
        <AgGrid<AgDataWithActions<LoanListType>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 211px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </Fragment>
    );
  }
);

LoanList.displayName = "LoanList";
