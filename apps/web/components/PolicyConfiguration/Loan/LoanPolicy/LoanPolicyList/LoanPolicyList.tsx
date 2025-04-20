"use client";

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
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { LoanPolicyListRef } from "../../../../../app/policy-configuration/loan/loan-policy/page";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeleteLoanPolicyDialog } from "../Dialogs/DeleteLoanPolicy";
import { EditLoanPolicyDialog } from "../Dialogs/EditLoanPolicyDialog";
import { ViewLoanPolicyDialog } from "../Dialogs/ViewLoanPolicyDialog";
import {
  type LoanPolicy,
  useGetLoanPoliciesQueryFn,
} from "./hooks/useGetLoanPolicies";
import { useLoanPoliciesColumns } from "./hooks/useLoanPoliciesColumns";

export type LoanPolicyListProps = { search?: string | null };

export const LoanPolicyList = forwardRef(
  (
    { search = null }: LoanPolicyListProps,
    ref: ForwardedRef<LoanPolicyListRef>
  ) => {
    const gridRef = useRef<AgGridReact<LoanPolicy>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentLoanPolicy, setCurrentLoanPolicy] = useState<LoanPolicy>();

    const [loading, setLoading] = useState(false);

    const { columns } = useLoanPoliciesColumns({
      onAction: (actionType, loanPolicy) => {
        onDialogOpen(actionType);
        setCurrentLoanPolicy(loanPolicy);
      },
      loading,
    });

    const { getLoanPolicies } = useGetLoanPoliciesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { loanPolicies, totalCount } = await getLoanPolicies({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (loanPolicies.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (loanPolicies.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(loanPolicies, lastRow);
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
      refreshLoanPolicyList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      edit: currentLoanPolicy && (
        <EditLoanPolicyDialog
          open
          policyId={currentLoanPolicy.id}
          onEditSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      delete: currentLoanPolicy && (
        <DeleteLoanPolicyDialog
          open
          loanPolicyData={currentLoanPolicy}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentLoanPolicy && (
        <ViewLoanPolicyDialog
          open
          policyId={currentLoanPolicy.id}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<LoanPolicy>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 160px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

LoanPolicyList.displayName = "LoanPolicyList";
