"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { Debounce_Delay } from "../../../../../../utils/helper";
import {
  BankShiftList,
  type BankShiftListRef,
} from "./BankShiftList/BankShiftList";
import { AddBankShiftDialog } from "./Dialogs/AddBankShiftDialog";

export const BankShiftDetailCard = () => {
  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const bankShiftDetailRef = useRef<BankShiftListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddBankShiftDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => bankShiftDetailRef.current?.refreshBankShiftList()}
      />
    ),
  };

  return (
    <>
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
            <Typography variant="h6">Bank Shift</Typography>

            <Box>
              <Stack direction="row" gap="5px">
                <SearchField name="search" control={control} />

                <Button variant="outlined" onClick={() => onDialogOpen("add")}>
                  <AddRoundedIcon fontSize="small" />
                  Add Bank Shift
                </Button>
              </Stack>
            </Box>
          </Stack>
        </PadBox>

        <BankShiftList ref={bankShiftDetailRef} search={searchInput} />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
