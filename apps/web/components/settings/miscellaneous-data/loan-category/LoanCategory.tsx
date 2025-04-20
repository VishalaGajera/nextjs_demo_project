import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";
import { AddLoanCategoryDialog } from "./Dialogs/AddLoanCategoryDialog";
import { LoanCategoryList } from "./LoanCategory/LoanCategoryList";

export type LoanCategoryListRef = {
  refreshLoanCategoryList: () => void;
};

export function LoanCategory() {
  const loanCategoryListRef = useRef<LoanCategoryListRef>(null);

  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddLoanCategoryDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          loanCategoryListRef.current?.refreshLoanCategoryList()
        }
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
            <Typography variant="subtitle1">Loan Category</Typography>

            <Stack direction="row" gap="5px">
              <SearchField name="search" control={control} />

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => onDialogOpen("add")}
              >
                Add Loan Category
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <LoanCategoryList ref={loanCategoryListRef} search={searchInput} />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
