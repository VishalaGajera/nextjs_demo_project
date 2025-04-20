import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import { type DialogRenderer } from "../../../../../types/dialogs";
import { Debounce_Delay } from "../../../../../utils/helper";
import AddLabourWelfareFundDialog from "./Dialogs/AddLabourWelfareFundDialog";
import { LabourWelfareFundListing } from "./LabourWelfareFundListing/LabourWelfareFundListing";

export type LabourWelfareFundListRef = {
  refreshLWFList: () => void;
};

export const LabourWelfareFundBody = () => {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const labourWelfareFundListRef = useRef<LabourWelfareFundListRef>(null);

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddLabourWelfareFundDialog
        open
        onAddSuccess={() => {
          labourWelfareFundListRef.current?.refreshLWFList();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
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
          <Typography variant="subtitle1">LWF</Typography>

          <Stack direction="row" gap="10px">
            <SearchField name="search" control={control} />
            <Button variant="outlined" onClick={() => onDialogOpen("add")}>
              <AddRoundedIcon fontSize="small" />
              Add LWF
            </Button>
          </Stack>
        </Stack>
      </PadBox>

      <LabourWelfareFundListing
        search={searchInput}
        ref={labourWelfareFundListRef}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </Box>
  );
};
