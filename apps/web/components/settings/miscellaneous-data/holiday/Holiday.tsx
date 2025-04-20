import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";
import { HolidayYearAutocomplete } from "../../../common/Autocomplete/HolidayYearAutocomplete";
import { AddHolidayDialog } from "./Dialogs/AddHolidayDialog";
import { HolidayList } from "./HolidayList/HolidayList";

export type HolidayListRef = {
  refreshHolidayList: () => void;
};

export function Holiday() {
  const holidayListRef = useRef<HolidayListRef>(null);

  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
      year: DateTime.now().year,
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddHolidayDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => holidayListRef.current?.refreshHolidayList()}
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
        <Stack>
          <PadBox padding={{ padding: "10px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">Holiday</Typography>

              <Stack direction="row" gap="5px">
                <Box sx={{ width: "150px" }}>
                  <HolidayYearAutocomplete
                    disableClearable
                    name="year"
                    control={control}
                  />
                </Box>

                <SearchField name="search" control={control} />

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => onDialogOpen("add")}
                >
                  Add Holiday
                </Button>
              </Stack>
            </Stack>
          </PadBox>

          <HolidayList
            ref={holidayListRef}
            search={searchInput}
            year={watch("year")}
          />
        </Stack>
      </Box>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
