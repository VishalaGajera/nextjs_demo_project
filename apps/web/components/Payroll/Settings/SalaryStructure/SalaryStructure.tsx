import { PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";
import { AddSalaryStructureDialog } from "./AddSalaryStructure/Dialogs/AddSalaryStructureDialog";
import {
  SalaryStructureList,
  type SalaryStructureListRefType,
} from "./SalaryStructureList/SalaryStructureList";

export const SalaryStructure = () => {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const salaryStructureListRef = useRef<SalaryStructureListRefType>(null);

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSalaryStructureDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => salaryStructureListRef.current?.refreshCache()}
      />
    ),
  };

  return (
    <Stack gap="10px">
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
            <Typography variant="subtitle1">Salary Structures</Typography>

            <Stack direction="row" gap="5px">
              <SearchField name="search" control={control} />

              <Button
                variant="outlined"
                onClick={() => onDialogOpen("add")}
                startIcon={<Add />}
              >
                Add Salary Structure
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <SalaryStructureList
          search={searchInput}
          ref={salaryStructureListRef}
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </Box>
    </Stack>
  );
};
