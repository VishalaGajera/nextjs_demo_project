"use client";

import {
  PadBox,
  Pagination,
  ProfileCard,
  ProfileCardBody,
  ProfileCardHeader,
} from "@codezee/sixtify-brahma";
import { Avatar, Box, Grid, Skeleton, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useApplicationContext } from "../../../../app/context/ApplicationContext";
import {
  DIRECTORY,
  EDIT_EMPLOYEE,
  LIST,
} from "../../../../app/employee-management/employee/hooks/constant";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import { employeeKeys } from "../../../../queryKeysFactories/employee";
import type { DialogRenderer } from "../../../../types/dialogs";
import { dateFormat } from "../../../../utils/date";
import { formatMobileNumber } from "../../../../utils/formatMobileNumber";
import { filterSearchParams } from "../../../../utils/helper";
import { formDefaultValues } from "../AddEmployee/EmployeeForm";
import { DeleteEmployeeDraftDialog } from "../Dialogs/DeleteEmployeeDraftDialog";
import type { EmployeeListProps } from "../EmployeeList/EmployeeList";
import type { Employee } from "../EmployeeList/hooks/useGetEmployees";
import {
  RESPONSE_FIELD_EMPLOYEE_DIRECTORY_VIEW,
  useGetEmployees,
} from "../EmployeeList/hooks/useGetEmployees";

const defaultValue = {
  id: "",
  avatar: "",
  employee_name: "",
  designation_name: "",
  employee_code: "",
  joining_date: "",
  department_name: "",
  sub_department_name: "",
  email: "",
  mobile_no: "",
};

export const EmployeeDirectory = ({
  search = null,
  isDraft = false,
  externalFilter,
}: EmployeeListProps) => {
  const { setEmployeeFormValues, documentFormValues, setDocumentFormValues } =
    useApplicationContext();

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const queryClient = useQueryClient();

  const [currentEmployee, setCurrentEmployee] = useState<Employee>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const searchParams = useSearchParams();

  const view = searchParams.get("view") === DIRECTORY ? DIRECTORY : LIST;

  const [page, setPage] = useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useMemo(() => page !== 0 && setPage(0), [isDraft]);

  useMemo(() => setPage(0), [search]);

  const router = useRouter();

  const theme = useTheme();

  const { slate, butterflyBlue } = theme.palette.app.color;

  const { data, isFetching } = useGetEmployees({
    body: {
      startRow: 0,
      externalFilter: { ...externalFilter, isDraft },
      responseFields: RESPONSE_FIELD_EMPLOYEE_DIRECTORY_VIEW,
      sortModel: [],
      filterModel: {},
      quickFilter: filterSearchParams(search),
    },
  });

  //TODO: manish implement a dynamic pagination.
  const startIndex = page * rowsPerPage;

  const endIndex = startIndex + rowsPerPage;

  const displayedEmployees = data.employees.slice(startIndex, endIndex);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProfileCard = (employeeId?: string) => {
    if (employeeId && isDraft) {
      if (!isEmpty(documentFormValues)) {
        setDocumentFormValues([]);
      }

      setEmployeeFormValues(formDefaultValues);

      router.push(
        `/employee-management/employee/${employeeId}?page=${EDIT_EMPLOYEE}&view=${view}&isDraft=true`
      );
    } else if (employeeId) {
      router.push(
        `/employee-management/employee/${employeeId}?tab=employee-profile&view=${view}`
      );
    }
  };

  const dialogRenderer: DialogRenderer = {
    delete: currentEmployee && (
      <DeleteEmployeeDraftDialog
        open
        employee={currentEmployee}
        onDeleteSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeeKeys.searchMetaData(),
          });

          queryClient.invalidateQueries({
            queryKey: employeeKeys.listing(),
          });
        }}
        onClose={onDialogClose}
      />
    ),
  };

  const employees = useMemo(() => {
    if (isFetching) {
      return Array(10).fill(defaultValue);
    }

    return displayedEmployees;
  }, [isFetching, displayedEmployees]);

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: slate[800],
          height: "calc(97vh - 297px)",
          overflowY: "scroll",
        }}
      >
        <PadBox padding={{ padding: "10px" }}>
          <Grid container spacing={1} sx={{ paddingBottom: "10px" }}>
            {employees.map((employee) => (
              <Grid item xs={12} sm={6} md={3} key={uuidv4()}>
                <ProfileCard
                  onClick={() => handleProfileCard(employee.id)}
                  header={
                    <ProfileCardHeader
                      avatar={
                        isFetching ? (
                          <Skeleton
                            variant="circular"
                            height="90px"
                            animation="wave"
                            width="90px"
                          />
                        ) : (
                          <Box
                            sx={{
                              border: `1px solid ${butterflyBlue[900]}`,
                              borderRadius: "100%",
                            }}
                          >
                            <PadBox padding={{ p: "5px" }}>
                              <Avatar
                                sx={{
                                  width: "80px",
                                  height: "80px",
                                }}
                                src={employee.avatar}
                                alt="Avatar"
                              />
                            </PadBox>
                          </Box>
                        )
                      }
                      onDeleteClick={(e) => {
                        e.stopPropagation();

                        if (employee) {
                          onDialogOpen("delete");

                          setCurrentEmployee(employee);
                        }
                      }}
                      isDraft={isDraft}
                      employeeName={employee.employee_name}
                      designation={employee.designation_name}
                      employeeCode={employee.employee_code}
                      loading={isFetching}
                    />
                  }
                  body={
                    <ProfileCardBody
                      joiningDate={
                        employee.joining_date
                          ? dateFormat(employee.joining_date, true)
                          : "-"
                      }
                      department={employee.department_name}
                      subDepartment={employee.sub_department_name}
                      email={employee.email}
                      phone={formatMobileNumber(employee.mobile_no)}
                      loading={isFetching}
                    />
                  }
                />
              </Grid>
            ))}
          </Grid>
        </PadBox>
      </Box>
      {data.employees.length > 10 && (
        <Pagination
          count={data.employees.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
