"use client";

import { AgGrid, defaultPageSize, toasts } from "@codezee/sixtify-brahma";
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
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../../types/agGrid";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { filterSearchParams } from "../../../../../utils/helper";
import { DeleteSkillTypeDialog } from "../Dialogs/DeleteSkillTypeDialog";
import { EditSkillTypeDialog } from "../Dialogs/EditSkillTypeDialog";
import { useEditSkillType } from "../Dialogs/hooks/useEditSkillType";
import { InActiveSkillTypeDialog } from "../Dialogs/InActiveSkillTypeDialog";
import { ViewSkillTypeDialog } from "../Dialogs/ViewSkillTypeDialog";
import type { SkillTypeListRef } from "../SkillType";
import {
  useGetSkillTypesQueryFn,
  type SkillType,
} from "./hooks/useGetSkillTypes";
import { useSkillTypeColumns } from "./hooks/useSkillTypeColumns";

export type SkillTypeListProps = { search?: string | null };

export const SkillTypeList = forwardRef(
  (
    { search = null }: SkillTypeListProps,
    ref: ForwardedRef<SkillTypeListRef>
  ) => {
    const gridRef = useRef<AgGridReact<SkillType>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentSkillType, setCurrentSkillType] = useState<SkillType>();

    const [loading, setLoading] = useState(false);

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const sectionId = currentSkillType?.id ?? "";

    const { mutate } = useEditSkillType({
      skillTypeId: sectionId,
      options: {
        onSuccess: (data) => {
          onDialogClose();
          refreshCache();
          toasts.success({ title: data.message });
        },
      },
    });

    const { columns } = useSkillTypeColumns({
      onAction: (actionType, skillType) => {
        onDialogOpen(actionType);
        setCurrentSkillType(skillType);
      },
      loading,
      onActive: () => {
        mutate({ is_active: true });
      },
    });

    const { getSkillTypes } = useGetSkillTypesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { skillTypes, totalCount } = await getSkillTypes({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (skillTypes.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (skillTypes.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(skillTypes, lastRow);
    };

    const dataSource: IDatasource = {
      getRows: (params) => {
        getRows(params);
      },
    };

    const onGridReady = useCallback((params: GridReadyEvent<SkillType>) => {
      params.api.setGridOption("datasource", dataSource);
    }, []);

    useImperativeHandle(ref, () => ({
      refreshSkillTypeList() {
        refreshCache();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    const dialogRenderer: DialogRenderer = {
      edit: currentSkillType && (
        <EditSkillTypeDialog
          open
          onClose={onDialogClose}
          skillTypeId={currentSkillType.id}
          onEditSuccess={refreshCache}
        />
      ),
      view: currentSkillType && (
        <ViewSkillTypeDialog
          open
          onClose={onDialogClose}
          skillTypeId={currentSkillType.id}
        />
      ),
      delete: currentSkillType && (
        <DeleteSkillTypeDialog
          open
          onClose={onDialogClose}
          skillType={currentSkillType}
          onDeleteSuccess={refreshCache}
        />
      ),
      action: currentSkillType && (
        <InActiveSkillTypeDialog
          open
          skillTypeId={currentSkillType.id}
          skillTypeName={currentSkillType.skill_type_name}
          onClose={onDialogClose}
          onSuccess={refreshCache}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<SkillType>>
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

SkillTypeList.displayName = "SkillTypeList";
