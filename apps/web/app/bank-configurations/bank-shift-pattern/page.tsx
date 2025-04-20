"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { BankShiftPatternBreadcrumbs } from "../../../components/BankConfiguration/BankShiftPattern/BankShiftPatternBreadcrumbs";
import { BankShiftPatternList } from "../../../components/BankConfiguration/BankShiftPattern/BankShiftPatternList/BankShiftPatternList";
import { AddBankShiftPatternDialog } from "../../../components/BankConfiguration/BankShiftPattern/Dialogs/AddBankShiftPatternDialog";
import { useDialogActions } from "../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../types/dialogs";
import { Debounce_Delay } from "../../../utils/helper";

export type BankShiftPatternListRef = {
  refreshBankShiftPatternList: () => void;
};

export default function Page() {
  const bankShiftPatternListRef = useRef<BankShiftPatternListRef>(null);

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
      <AddBankShiftPatternDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          bankShiftPatternListRef.current?.refreshBankShiftPatternList()
        }
      />
    ),
  };

  return (
    <>
      <Stack gap="10px">
        <BankShiftPatternBreadcrumbs />

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
              <Typography variant="h6">Bank Shift Pattern</Typography>

              <Box>
                <Stack direction="row" gap="5px">
                  <SearchField name="search" control={control} />

                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => onDialogOpen("add")}
                  >
                    Add Bank Shift Pattern
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </PadBox>

          <BankShiftPatternList
            ref={bankShiftPatternListRef}
            search={searchInput}
          />
        </Box>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
