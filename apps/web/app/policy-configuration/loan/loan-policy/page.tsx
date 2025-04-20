"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AddLoanPolicyDialog } from "../../../../components/PolicyConfiguration/Loan/LoanPolicy/Dialogs/AddLoanPolicyDialog";
import { LoanPolicyBreadcrumbs } from "../../../../components/PolicyConfiguration/Loan/LoanPolicy/LoanPolicyBreadcrumbs";
import { LoanPolicyList } from "../../../../components/PolicyConfiguration/Loan/LoanPolicy/LoanPolicyList/LoanPolicyList";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";

export type LoanPolicyListRef = {
  refreshLoanPolicyList: () => void;
};

export default function Page() {
  const loanPolicyListRef = useRef<LoanPolicyListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddLoanPolicyDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => loanPolicyListRef.current?.refreshLoanPolicyList()}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <LoanPolicyBreadcrumbs />

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
            <Typography variant="h6">Loan Policy</Typography>

            <Box>
              <Stack direction="row" gap="5px">
                <SearchField name="search" control={control} />

                <Button
                  variant="outlined"
                  sx={{ width: "210px" }}
                  onClick={() => onDialogOpen("add")}
                >
                  <AddRoundedIcon fontSize="small" />
                  Add Loan Policy
                </Button>
              </Stack>
            </Box>
          </Stack>
        </PadBox>

        <LoanPolicyList ref={loanPolicyListRef} search={searchInput} />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
