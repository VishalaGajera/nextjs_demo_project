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
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
} from "react";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../../utils/helper";
import type { SalaryComponent } from "../../SalaryComponentForm";
import type { ContributionListRef } from "../Contribution";
import { DeleteContributionDialog } from "../Dialogs/DeleteContributionDialog";
import { EditContributionDialog } from "../Dialogs/EditContributionDialog";
import { ViewContributionDialog } from "../Dialogs/ViewContributionDialog";
import { useContributionColumns } from "./hooks/useContributionColumns";
import { useGetContributionsQueryFn } from "./hooks/useGetContributions";

export type ContributionListProps = { search?: string | null };

export const ContributionList = forwardRef(
  (
    { search = null }: ContributionListProps,
    ref: ForwardedRef<ContributionListRef>
  ) => {
    const gridRef = useRef<AgGridReact<SalaryComponent>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentContribution, setCurrentContribution] =
      useState<SalaryComponent>();

    const [loading, setLoading] = useState(false);

    const { columns } = useContributionColumns({
      onAction: (actionType, contribution) => {
        onDialogOpen(actionType);
        setCurrentContribution(contribution);
      },
      loading,
    });

    const { getContributions } = useGetContributionsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { contributionComponents, totalCount } = await getContributions({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (contributionComponents.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (contributionComponents.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(contributionComponents, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback(
      (params: GridReadyEvent<SalaryComponent>) => {
        params.api.setGridOption("datasource", dataSource);
      },
      []
    );

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshContributionList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentContribution && (
        <EditContributionDialog
          open
          onClose={onDialogClose}
          contributionId={currentContribution.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentContribution && (
        <DeleteContributionDialog
          open
          contribution={currentContribution}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentContribution && (
        <ViewContributionDialog
          open
          onClose={onDialogClose}
          contributionId={currentContribution.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<SalaryComponent>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(89vh - 160px)"
          pagination
        />
        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

ContributionList.displayName = "ContributionList";
