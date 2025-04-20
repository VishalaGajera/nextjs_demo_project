"use client";

import { AgGrid, defaultPageSize } from "@codezee/sixtify-brahma";
import { useQueryClient } from "@tanstack/react-query";
import type {
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { isEmpty } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
  type MouseEvent,
} from "react";
import type { FieldValues } from "react-hook-form";
import { useApplicationContext } from "../../../../app/context/ApplicationContext";
import {
  DIRECTORY,
  EDIT_EMPLOYEE,
  LIST,
} from "../../../../app/employee-management/employee/hooks/constant";
import type { EmployeeListRef } from "../../../../app/employee-management/employee/page";
import { useAgGridPdfExport } from "../../../../hooks/useAgGridPdfExport";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import {
  useExcelExport,
  type ColumnConfig,
} from "../../../../hooks/useExcelExport";
import { useNavigateToRoute } from "../../../../hooks/useNavigateToRoute";
import { employeeKeys } from "../../../../queryKeysFactories/employee";
import type { AgDataWithActions } from "../../../../types/agGrid";
import type { DialogRenderer } from "../../../../types/dialogs";
import { filterSearchParams } from "../../../../utils/helper";
import { formDefaultValues } from "../AddEmployee/EmployeeForm";
import { DeleteEmployeeDraftDialog } from "../Dialogs/DeleteEmployeeDraftDialog";
import { useEmployeeColumns } from "./hooks/useEmployeeColumns";
import { useGetEmployeesQueryFn, type Employee } from "./hooks/useGetEmployees";

export type EmployeeListProps = {
  search?: string | null;
  externalFilter?: FieldValues;
  isDraft?: boolean;
};

export const EmployeeList = forwardRef(
  (
    { search = null, externalFilter, isDraft = false }: EmployeeListProps,
    ref: ForwardedRef<EmployeeListRef>
  ) => {
    const queryClient = useQueryClient();

    const gridRef = useRef<AgGridReact<Employee>>(null);

    const { setEmployeeFormValues, documentFormValues, setDocumentFormValues } =
      useApplicationContext();

    const [loading, setLoading] = useState(false);

    const [currentEmployee, setCurrentEmployee] = useState<Employee>();

    const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

    const navigateToNewPage = useNavigateToRoute();

    const router = useRouter();

    const searchParams = useSearchParams();

    const view = searchParams.get("view") === DIRECTORY ? DIRECTORY : LIST;

    const { exportToExcel } = useExcelExport();

    const { exportToPDF } = useAgGridPdfExport();

    const handleClickOnEmployee = (
      employeeId: string,
      e: MouseEvent<HTMLSpanElement>
    ) => {
      if (isDraft && employeeId) {
        if (!isEmpty(documentFormValues)) {
          setDocumentFormValues([]);
        }

        setEmployeeFormValues(formDefaultValues);

        navigateToNewPage(
          e,
          `/employee-management/employee/${employeeId}?page=${EDIT_EMPLOYEE}&view=${view}&isDraft=true`
        );
      } else if (employeeId) {
        navigateToNewPage(
          e,
          `/employee-management/employee/${employeeId}?tab=employee-profile`
        );
      }
    };

    const { columns } = useEmployeeColumns({
      loading,
      isDraft,
      handleClickOnEmployee,
      onAction: (type, employee) => {
        if (type === "edit" && employee.id) {
          if (!isEmpty(documentFormValues)) {
            setDocumentFormValues([]);
          }

          setEmployeeFormValues(formDefaultValues);

          router.push(
            `/employee-management/employee/${employee.id}?page=${EDIT_EMPLOYEE}&view=${view}&isDraft=true`
          );
        } else if (type === "delete" && employee) {
          onDialogOpen(type);

          setCurrentEmployee(employee);
        }
      },
    });

    const { getEmployees } = useGetEmployeesQueryFn();

    const getRows = async (params: IGetRowsParams) => {
      setLoading(true);

      const { employees, totalCount } = await getEmployees({
        body: {
          ...params,
          externalFilter: { ...externalFilter, isDraft },
          quickFilter: filterSearchParams(search),
        },
      });

      let lastRow = -1;

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

    const refreshCache = () => {
      gridRef.current?.api.refreshInfiniteCache();
    };

    const employeeColumnsToRemove = [
      "id",
      "avatar",
      "bank_name",
      "action_by",
      "uan_no",
      "bank_name",
      "payment_type",
    ];

    const exportExcel = async () => {
      if (gridRef.current) {
        const excelColumns: ColumnConfig<Employee>[] = columns
          .filter(
            (col) => !employeeColumnsToRemove.includes(col.field as string)
          )
          .map((data) => ({
            header: data.headerName ?? "",
            key: data.field as keyof Employee,
            width: 25,
          }));

        exportToExcel<Employee>({
          gridApi: gridRef.current.api,
          fileName: "employeesList",
          sheetName: "Employees",
          columns: excelColumns,
          dateKeys: ["joining_date", "date_of_birth"],
        });
      }
    };

    const exportPDF = () => {
      if (gridRef.current) {
        exportToPDF(gridRef.current.api, {
          fileName: "employeesList",
          columnsToRemove: employeeColumnsToRemove,
          dateKeys: ["joining_date", "date_of_birth"],
        });
      }
    };

    useImperativeHandle(ref, () => ({
      refreshEmployeeList() {
        refreshCache();
      },
      exportEmployeeListExcel() {
        exportExcel();
      },
      exportEmployeeListPDF() {
        exportPDF();
      },
    }));

    useEffect(() => {
      if (gridRef.current?.api) {
        gridRef.current.api.setGridOption("datasource", dataSource);
      }
    }, [search, isDraft, externalFilter]);

    const dialogRenderer: DialogRenderer = {
      delete: currentEmployee && (
        <DeleteEmployeeDraftDialog
          open
          employee={currentEmployee}
          onDeleteSuccess={() => {
            refreshCache();

            queryClient.invalidateQueries({
              queryKey: employeeKeys.searchMetaData(),
            });
          }}
          onClose={onDialogClose}
        />
      ),
    };

    if (loading) {
      gridRef.current?.api.hideOverlay();
    }

    return (
      <>
        <AgGrid<AgDataWithActions<Employee>>
          ref={gridRef}
          columnDefs={columns}
          onGridReady={onGridReady}
          height="calc(88vh - 160px)"
          pagination
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

EmployeeList.displayName = "EmployeeList";
