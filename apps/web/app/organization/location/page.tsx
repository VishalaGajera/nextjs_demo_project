"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AddLocationDialog } from "../../../components/organization/location/Dialogs/AddLocationDialog";
import { LocationBreadcrumbs } from "../../../components/organization/location/LocationBreadcrumbs";
import { LocationList } from "../../../components/organization/location/LocationList/LocationList";
import { useDialogActions } from "../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../types/dialogs";
import { Debounce_Delay } from "../../../utils/helper";

export type LocationListRef = {
  refreshLocationList: () => void;
};

export default function Page() {
  const locationListRef = useRef<LocationListRef>(null);

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
      <AddLocationDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => locationListRef.current?.refreshLocationList()}
      />
    ),
  };

  return (
    <>
      <Stack gap="10px">
        <LocationBreadcrumbs />

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
              <Typography variant="subtitle1">Location</Typography>

              <Stack direction="row" gap="5px">
                <SearchField name="search" control={control} />

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => onDialogOpen("add")}
                >
                  Add Location
                </Button>
              </Stack>
            </Stack>
          </PadBox>

          <LocationList ref={locationListRef} search={searchInput} />
        </Box>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
