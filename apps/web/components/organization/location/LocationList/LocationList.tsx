"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import type { ForwardedRef } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { LocationListRef } from "../../../../app/organization/location/page";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { AgDataWithActions } from "../../../../types/agGrid";
import type { DialogRenderer } from "../../../../types/dialogs";
import { filterSearchParams } from "../../../../utils/helper";
import { DeleteLocationDialog } from "../Dialogs/DeleteLocationDialog";
import { EditLocationUnitDialog } from "../Dialogs/EditLocationDialog";
import { ViewLocationUnitDialog } from "../Dialogs/ViewLocationDialog";
import { type Location, useGetLocationsQueryFn } from "./hooks/useGetLocations";
import { useLocationColumns } from "./hooks/useLocationColumns";

export type LocationListProps = { search?: string | null };

export const LocationList = forwardRef(
  (
    { search = null }: LocationListProps,
    ref: ForwardedRef<LocationListRef>
  ) => {
    const gridRef = useRef<AgGridReact<Location>>(null);

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const [currentLocation, setCurrentLocation] = useState<Location>();

    const [loading, setLoading] = useState(false);

    const { columns } = useLocationColumns({
      onAction: (actionType, location) => {
        onDialogOpen(actionType);
        setCurrentLocation(location);
      },
      loading,
    });

    const { getLocations } = useGetLocationsQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { businessUnitLocations, totalCount } = await getLocations({
        body: {
          ...params,
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

      if (businessUnitLocations.length <= defaultPageSize) {
        lastRow = totalCount;
      }

      setLoading(false);

      if (businessUnitLocations.length === 0) {
        gridRef.current?.api.showNoRowsOverlay();
      } else {
        gridRef.current?.api.hideOverlay();
      }

      return params.successCallback(businessUnitLocations, lastRow);
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

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search]);

    useImperativeHandle(ref, () => ({
      refreshLocationList() {
        refreshCache();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      edit: currentLocation && (
        <EditLocationUnitDialog
          open
          onClose={onDialogClose}
          locationId={currentLocation.id}
          onEditSuccess={refreshCache}
        />
      ),
      delete: currentLocation && (
        <DeleteLocationDialog
          open
          location={currentLocation}
          onDeleteSuccess={refreshCache}
          onClose={onDialogClose}
        />
      ),
      view: currentLocation && (
        <ViewLocationUnitDialog
          open
          onClose={onDialogClose}
          locationId={currentLocation.id}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<Location>>
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

LocationList.displayName = "LocationList";
