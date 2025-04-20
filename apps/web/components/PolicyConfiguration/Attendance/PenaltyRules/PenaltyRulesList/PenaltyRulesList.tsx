"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";

import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
} from "react";

import { useRouter } from "next/navigation";
import type { PenaltyRulesListRef } from "../../../../../app/policy-configuration/attendance/penalty-rules/page";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeletePenaltyRulesDialog } from "../Dialogs/DeletePenaltyRulesDialog";
import {
  useGetPenaltyRulesQueryFn,
  type PenaltyRules,
} from "./hooks/useGetPenaltyRules";
import { usePenaltyRulesColumns } from "./hooks/usePenaltyRulesColumns";

export type PenaltyRulesListProps = { search?: string | null };

export const PenaltyRulesList = forwardRef(
  (
    { search = null }: PenaltyRulesListProps,
    ref: ForwardedRef<PenaltyRulesListRef>
  ) => {
    const router = useRouter();

    const gridRef = useRef<AgGridReact<PenaltyRules>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentPenaltyRules, setCurrentPenaltyRules] =
      useState<PenaltyRules>();

    const [loading, setLoading] = useState(false);

    const { columns } = usePenaltyRulesColumns({
      onAction: (actionType, PenaltyRules) => {
        if (actionType === "edit") {
          router.push(
            `/policy-configuration/attendance/penalty-rules/${PenaltyRules.id}`
          );
        } else {
          onDialogOpen(actionType);
        }
        setCurrentPenaltyRules(PenaltyRules);
      },
      loading,
    });

    const { getPenaltyRules } = useGetPenaltyRulesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { attendancePenaltyRules, totalCount } = await getPenaltyRules({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (attendancePenaltyRules.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (attendancePenaltyRules.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(attendancePenaltyRules, lastRow);
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
      refreshPenaltyRulesList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      delete: currentPenaltyRules && (
        <DeletePenaltyRulesDialog
          open
          penaltyRules={currentPenaltyRules}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <Fragment>
        <AgGrid<AgDataWithActions<PenaltyRules>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(95vh - 160px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </Fragment>
    );
  }
);

PenaltyRulesList.displayName = "PenaltyRulesList";
