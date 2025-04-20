"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { Debounce_Delay } from "../../../../../../utils/helper";
import { AddGratuityDialog } from "./Dialogs/AddGratuityDialog";
import {
  GratuityList,
  type GratuityListRefType,
} from "./GratuityList/GratuityList";

export const GratuityTab = () => {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const gratuityListRef = useRef<GratuityListRefType>(null);

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddGratuityDialog
        onAddSuccess={() => {
          gratuityListRef.current?.refresh();
        }}
        onClose={onDialogClose}
        open
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
            <Typography variant="subtitle1">Gratuity</Typography>

            <Stack direction="row" gap="5px">
              <SearchField name="search" control={control} />

              <Button
                variant="outlined"
                onClick={() => onDialogOpen("add")}
                startIcon={<Add />}
              >
                Add Gratuity
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <GratuityList ref={gratuityListRef} search={searchInput} />

        {openedDialog && dialogRenderer[openedDialog]}
      </Box>
    </Stack>
  );
};
