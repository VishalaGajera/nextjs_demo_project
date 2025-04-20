"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AddEmployeeCodeDialog } from "../../../components/settings/employee-code/Dialogs/AddEmployeeCodeDialog";
import { EmployeeCodeBreadcrumbs } from "../../../components/settings/employee-code/EmployeeCodeBreadcrumbs";
import { EmployeeCodeList } from "../../../components/settings/employee-code/EmployeeCodeList/EmployeeCodeList";
import { useDialogActions } from "../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../types/dialogs";
import { Debounce_Delay } from "../../../utils/helper";

export type EmployeeCodeListRef = {
  refreshEmployeeCodeList: () => void;
};

export default function Page() {
  const employeeCodeListRef = useRef<EmployeeCodeListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddEmployeeCodeDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          employeeCodeListRef.current?.refreshEmployeeCodeList()
        }
      />
    ),
  };

  return (
    <>
      <Stack gap="10px">
        <EmployeeCodeBreadcrumbs />

        <Box
          sx={{
            background: iron[600],
            border: `1px solid ${butterflyBlue[300]}`,
            borderRadius: "6px",
            height: "100%",
            width: "100%",
          }}
        >
          <PadBox padding={{ padding: "10px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">Employee Code</Typography>

              <Stack direction="row" gap="5px">
                <SearchField name="search" control={control} />

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => onDialogOpen("add")}
                >
                  Add Employee Code
                </Button>
              </Stack>
            </Stack>
          </PadBox>

          <EmployeeCodeList ref={employeeCodeListRef} search={searchInput} />
        </Box>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
