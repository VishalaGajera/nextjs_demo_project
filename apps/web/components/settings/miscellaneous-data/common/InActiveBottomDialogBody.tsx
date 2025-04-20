import { AgGrid, Button, defaultPageSize } from "@codezee/sixtify-brahma";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { Alert, Stack } from "@mui/material";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import type { AgDataWithActions } from "../../../../types/agGrid";
import {
  useGetSectionEmployee,
  type EmployeeData,
} from "../hooks/useGetSectionEmployee";
import { useGetSectionEmployeeColumn } from "../hooks/useGetSectionEmployeeColumn";

type InActiveBottomDialogBodyProps = {
  sectionId: string;
  section: string;
  alertKey: string;
  onInActive: () => void;
};

export const InActiveBottomDialogBody = ({
  sectionId,
  section,
  alertKey,
  onInActive,
}: InActiveBottomDialogBodyProps) => {
  const gridRef = useRef<AgGridReact<EmployeeData>>(null);

  const [loading, setLoading] = useState(false);

  const [employeeList, setEmployeeList] = useState<EmployeeData[]>();

  const router = useRouter();

  const { columns } = useGetSectionEmployeeColumn({
    loading,
  });

  const handleRowClick = (
    event: RowClickedEvent<AgDataWithActions<EmployeeData>>
  ) => {
    const { data } = event;

    const employeeId = data?.employee_id;

    router.push(
      `/employee-management/employee/${employeeId}?tab=org-post-policy&subtab=post-details`
    );
  };

  const { getEmployees } = useGetSectionEmployee();

  const getRows = async (params: IGetRowsParams) => {
    setLoading(true);

    const { employees, totalCount } = await getEmployees({
      body: {
        ...params,
      },
      section,
      sectionId,
    });

    let lastRow = -1;

    setEmployeeList(employees);

    if (employees.length <= defaultPageSize) {
      lastRow = totalCount;
    }

    setLoading(false);

    if (employees.length === 0) {
      gridRef.current?.api.showNoRowsOverlay();
    } else {
      gridRef.current?.api.hideOverlay();
    }

    return params.successCallback(employees, lastRow);
  };

  const dataSource: IDatasource = {
    getRows: (params) => {
      getRows(params);
    },
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption("datasource", dataSource);
  }, []);

  const getRowStyle = () => ({
    cursor: "pointer",
  });

  if (loading) {
    gridRef.current?.api.hideOverlay();
  }

  return (
    <Stack gap="20px">
      {employeeList?.length ? (
        <Alert variant="outlined" severity="error">
          This {alertKey} is already in use by the employees listed below.
          Please change or update their {alertKey} before deactivating this{" "}
          {alertKey}.
        </Alert>
      ) : (
        <Stack flexDirection="row" gap="15px">
          <Alert variant="outlined" severity="success" sx={{ width: "100%" }}>
            This {alertKey} is not currently assigned to any employees. You can
            proceed with deactivating this {alertKey}.
          </Alert>
          <Button onClick={() => onInActive()} variant="outlined">
            <BlockOutlinedIcon sx={{ marginRight: "10px" }} /> Inactive
          </Button>
        </Stack>
      )}
      <AgGrid<AgDataWithActions<EmployeeData>>
        ref={gridRef}
        columnDefs={columns}
        onGridReady={onGridReady}
        onRowClicked={handleRowClick}
        getRowStyle={getRowStyle}
        height="calc(79vh - 145px)"
      />
    </Stack>
  );
};
