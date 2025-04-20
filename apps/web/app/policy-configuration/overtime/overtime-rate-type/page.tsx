"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AddOvertimeRateTypeDialog } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRateType/Dialogs/AddOvertimeRateTypeDialog";
import { OvertimeRateTypeBreadcrumbs } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRateType/OvertimeRateTypeBreadcrumbs";
import { OvertimeRateTypeList } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRateType/OvertimeRateTypeList/OvertimeRateTypeList";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";

export type OvertimeRateTypeListRef = {
  refreshOvertimeRateTypeList: () => void;
};
export default function Page() {
  const overtimeRateTypeListRef = useRef<OvertimeRateTypeListRef>(null);

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
      <AddOvertimeRateTypeDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          overtimeRateTypeListRef.current?.refreshOvertimeRateTypeList()
        }
      />
    ),
  };

  return (
    <>
      <Stack gap="10px">
        <OvertimeRateTypeBreadcrumbs />

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
              <Typography variant="subtitle1">Overtime Rate Type</Typography>

              <Stack direction="row" gap="5px">
                <SearchField name="search" control={control} />

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => onDialogOpen("add")}
                >
                  Add Overtime Rate Type
                </Button>
              </Stack>
            </Stack>
          </PadBox>

          <OvertimeRateTypeList
            ref={overtimeRateTypeListRef}
            search={searchInput}
          />
        </Box>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
