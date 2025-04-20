"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { BusinessUnitBreadcrumbs } from "../../../components/organization/business-unit/BusinessUnitBreadcrumbs";
import { BusinessUnitList } from "../../../components/organization/business-unit/BusinessUnitList/BusinessUnitList";
import { AddBusinessUnitDialog } from "../../../components/organization/business-unit/Dialogs/AddBusinessUnitDialog";
import { useDialogActions } from "../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../types/dialogs";
import { Debounce_Delay } from "../../../utils/helper";

export type BusinessUnitListRef = {
  refreshBusinessUnitList: () => void;
};
export default function Page() {
  const businessUnitListRef = useRef<BusinessUnitListRef>(null);

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
      <AddBusinessUnitDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          businessUnitListRef.current?.refreshBusinessUnitList()
        }
      />
    ),
  };

  return (
    <>
      <Stack gap="10px">
        <BusinessUnitBreadcrumbs />

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
              <Typography variant="subtitle1">Business Unit</Typography>

              <Stack direction="row" gap="5px">
                <SearchField name="search" control={control} />
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => onDialogOpen("add")}
                >
                  Add Business Unit
                </Button>
              </Stack>
            </Stack>
          </PadBox>

          <BusinessUnitList ref={businessUnitListRef} search={searchInput} />
        </Box>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
