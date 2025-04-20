"use client";

import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  CheckBox,
  PadBox,
  SearchField,
  SvgsHome,
} from "@codezee/sixtify-brahma";
import { Add, IosShare } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { isEmpty } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import AddDraftEmployeeDialog from "../../../components/EmployeeManagement/Employee/AddEmployee/AddDraftEmployeeDialog";
import { AddEmployee } from "../../../components/EmployeeManagement/Employee/AddEmployee/AddEmployee";
import { formDefaultValues } from "../../../components/EmployeeManagement/Employee/AddEmployee/EmployeeForm";
import { EmployeeDirectory } from "../../../components/EmployeeManagement/Employee/EmployeeDirectory/EmployeeDirectory";
import { EmployeeFilter } from "../../../components/EmployeeManagement/Employee/EmployeeList/EmployeeFilter";
import { EmployeeList } from "../../../components/EmployeeManagement/Employee/EmployeeList/EmployeeList";
import { useGetEmployeeSearchMetaData } from "../../../components/EmployeeManagement/Employee/EmployeeList/hooks/useGetEmployeeSearchMetaData";
import { useDialogActions } from "../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../types/dialogs";
import { Debounce_Delay } from "../../../utils/helper";
import { useApplicationContext } from "../../context/ApplicationContext";
import { ADD_EMPLOYEE, DIRECTORY, LIST } from "./hooks/constant";
import { useGetButtonOptions } from "./hooks/useGetButtonOptions";

const employeePage = {
  [ADD_EMPLOYEE]: "Add Employee",
};

type EmployeePageType = keyof typeof employeePage;

const employeePageRenderer: Record<EmployeePageType, ReactNode> = {
  [ADD_EMPLOYEE]: <AddEmployee />,
};

export type EmployeeListRef = {
  refreshEmployeeList: () => void;
  exportEmployeeListExcel: () => void;
  exportEmployeeListPDF: () => void;
};

export default function Page() {
  const employeeListRef = useRef<EmployeeListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const router = useRouter();

  const {
    isOpenAddEditEmployeePage,
    documentFormValues,
    setDocumentFormValues,
    setEmployeeFormValues,
  } = useApplicationContext();

  const view = searchParams.get("view") === DIRECTORY ? DIRECTORY : LIST;

  const isDraftParam =
    searchParams.get("isDraft") === "true"
      ? Boolean(searchParams.get("isDraft"))
      : false;

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      isDraft: isDraftParam,
    },
  });

  const isDraft = watch("isDraft");

  const dialogRenderer: DialogRenderer = {
    saveAsDraft: (
      <AddDraftEmployeeDialog
        open
        onDialogClose={onDialogClose}
        onSuccess={() => {
          router.push(
            `/employee-management/employee?view=${view}${isDraft ? "&isDraft=true" : ""}`
          );
        }}
      />
    ),
  };

  const {
    data: { draftCount },
    isFetching,
  } = useGetEmployeeSearchMetaData();

  const { buttonOptions } = useGetButtonOptions({ view, isDraft });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openedPage = searchParams.get("page") === ADD_EMPLOYEE;

  const queryPage =
    searchParams.get("page") === ADD_EMPLOYEE ? ADD_EMPLOYEE : "";

  const selectedEmployeePage = Object.keys(employeePage).includes(queryPage);

  const breadcrumbsItems = [
    {
      icon: <SvgsHome />,
      onClick: () => {
        if (isOpenAddEditEmployeePage) {
          onDialogOpen("saveAsDraft");
        } else {
          router.push("/");
        }
      },
    },
    {
      text: "Employee Management",
    },
    ...(queryPage
      ? [
          {
            text: "Employee",
            onClick: () => {
              if (isOpenAddEditEmployeePage) {
                onDialogOpen("saveAsDraft");
              } else {
                router.push("/employee-management/employee");
              }
            },
          },
        ]
      : [{ text: "Employee" }]),
  ];

  if (!view && !queryPage) {
    router.push(
      `/employee-management/employee?view=${LIST}${isDraft ? "&isDraft=true" : ""}`
    );
  }

  useMemo(() => {
    if (!isDraftParam && isDraft) {
      router.push(`/employee-management/employee?view=${view}&isDraft=true`);
    } else if (isDraftParam && !isDraft) {
      router.push(`/employee-management/employee?view=${view}`);
    }
  }, [isDraft]);

  const categoryRenderer = {
    list: (
      <EmployeeList
        ref={employeeListRef}
        externalFilter={filterListData}
        search={searchInput}
        isDraft={isDraft}
      />
    ),
    directory: (
      <EmployeeDirectory
        search={searchInput}
        externalFilter={filterListData}
        isDraft={isDraft}
      />
    ),
  };

  useMemo(() => {
    if (!isFetching && !Number(draftCount) && isDraft) {
      setValue("isDraft", false);
    }
  }, [isFetching]);

  const handelExportXLS = () => {
    employeeListRef.current?.exportEmployeeListExcel();
    handleClose();
  };

  const handelExportPDF = () => {
    employeeListRef.current?.exportEmployeeListPDF();
    handleClose();
  };

  return (
    <>
      <Stack gap="5px">
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Breadcrumbs
            items={
              queryPage
                ? [
                    ...breadcrumbsItems,
                    {
                      text: employeePage[queryPage],
                    },
                  ]
                : breadcrumbsItems
            }
          />
          {!openedPage && <ButtonGroup renderButtons={buttonOptions} />}
        </Stack>

        {!selectedEmployeePage && (
          <Box
            sx={{
              background: iron[600],
              border: `1px solid ${butterflyBlue[300]}`,
              borderRadius: "6px",
              height: "100%",
              width: "100%",
              gap: "10px",
            }}
          >
            <Stack
              height="60px"
              paddingX="15px"
              direction="row"
              gap="5px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Employee</Typography>

              <Stack direction="row" gap="10px">
                <Stack direction="row" gap="10px" alignItems="center">
                  <CheckBox
                    name="isDraft"
                    disabled={!Number(draftCount || 0)}
                    control={control}
                    size="small"
                  />

                  <InputLabel disabled={!Number(draftCount || 0)}>
                    Show Drafts ({Number(draftCount) || 0})
                  </InputLabel>
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    if (!isEmpty(documentFormValues)) {
                      setDocumentFormValues([]);
                    }

                    setEmployeeFormValues(formDefaultValues);

                    router.push(
                      `/employee-management/employee?page=${ADD_EMPLOYEE}&view=${view}${isDraft ? "&isDraft=true" : ""}`
                    );
                  }}
                >
                  Add Employee
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        <Box
          sx={{
            background: iron[600],
            border: `1px solid ${butterflyBlue[300]}`,
            borderRadius: "6px",
            height: "100%",
            width: "100%",
            gap: "10px",
          }}
        >
          {!selectedEmployeePage && (
            <PadBox padding={{ padding: "10px" }}>
              <Stack direction="row" gap="5px" justifyContent="flex-end">
                <EmployeeFilter
                  filterListData={filterListData}
                  setFilterListData={setFilterListData}
                />

                {view === LIST && (
                  <IconButton
                    onClick={handleClick}
                    sx={{
                      height: "38px",
                      width: "36px",
                      border: `0.5px solid ${iron[800]}`,
                      marginRight: "5px",
                    }}
                    disabled={isFetching}
                  >
                    <IosShare fontSize="small" sx={{ fill: `${iron[400]}` }} />
                  </IconButton>
                )}

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem onClick={handelExportXLS}>XLS</MenuItem>

                  <MenuItem onClick={handelExportPDF}>PDF</MenuItem>
                </Menu>

                <SearchField name="search" control={control} />
              </Stack>
            </PadBox>
          )}
          {selectedEmployeePage ? (
            <PadBox padding={{ padding: "20px" }}>
              {queryPage && employeePageRenderer[queryPage]}
            </PadBox>
          ) : (
            view && categoryRenderer[view as keyof typeof categoryRenderer]
          )}
        </Box>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
