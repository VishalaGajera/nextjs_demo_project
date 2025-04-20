import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { Debounce_Delay } from "../../../../utils/helper";
import { AdvanceAndReceiveFilter } from "./AdvanceAndReceiveList/AdvanceAndReceiveFilter";
import { AdvanceAndReceiveList } from "./AdvanceAndReceiveList/AdvanceAndReceiveList";
import { AddAdvanceAndReceiveDialog } from "./Dialogs/AddAdvanceAndReceiveDialog";

export type AdvanceAndReceiveListRef = {
  refreshAdvanceAndReceiveList: () => void;
};

export const AdvanceAndReceive = () => {
  const advanceAndReceiveListRef = useRef<AdvanceAndReceiveListRef>(null);

  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddAdvanceAndReceiveDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          advanceAndReceiveListRef.current?.refreshAdvanceAndReceiveList()
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
            <Typography variant="h6">Advance & Receive</Typography>

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => onDialogOpen("add")}
            >
              Add Advance & Receive
            </Button>
          </Stack>
        </PadBox>
      </Box>

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
          <Stack direction="row" gap="5px" justifyContent="flex-end">
            <AdvanceAndReceiveFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <SearchField name="search" control={control} />
          </Stack>
        </PadBox>

        <AdvanceAndReceiveList
          search={searchInput}
          ref={advanceAndReceiveListRef}
          externalFilter={filterListData}
        />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
