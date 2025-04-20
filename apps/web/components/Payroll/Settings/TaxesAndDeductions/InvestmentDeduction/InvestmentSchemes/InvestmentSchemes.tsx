import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import { Debounce_Delay } from "../../../../../../utils/helper";
import { AddInvestmentSchemesDialog } from "./Dialogs/AddInvestmentSchemesDialog";
import { InvestmentSchemesList } from "./InvestmentSchemesList/InvestmentSchemesList";

export type InvestmentSchemesListRef = {
  refreshInvestmentSchemesList: () => void;
};

export const InvestmentSchemes = () => {
  const investmentSchemesListRef = useRef<InvestmentSchemesListRef>(null);

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
      <AddInvestmentSchemesDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          investmentSchemesListRef.current?.refreshInvestmentSchemesList()
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
        <Stack>
          <Box
            sx={{
              borderBottom: `1px solid ${butterflyBlue[300]}`,
            }}
          >
            <PadBox padding={{ padding: "10px" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Investment Schemes</Typography>

                <Stack direction="row" gap="5px">
                  <SearchField name="search" control={control} />

                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => onDialogOpen("add")}
                  >
                    Add Investment Schemes
                  </Button>
                </Stack>
              </Stack>
            </PadBox>
          </Box>

          <InvestmentSchemesList
            ref={investmentSchemesListRef}
            search={searchInput}
          />
        </Stack>
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
