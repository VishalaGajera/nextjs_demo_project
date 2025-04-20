import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import type { leavePlanFormField } from "../../../../../app/policy-configuration/leave/leave-plan/page";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import { leavePlanKeys } from "../../../../../queryKeysFactories/leavePlan";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { CompanyAutocomplete } from "../../../../common/Autocomplete/CompanyAutocomplete";
import { AddLeavePlanDialog } from "./Dialog/AddLeavePlanDialog";
import { LeavePlanList } from "./LeavePlanList";
import type { LeavePlanListData } from "./hooks/useGetLeavePlanList";

type LeavePlanSideBarProps = Readonly<{
  leavePlanId: string;
  leavePlanListData: LeavePlanListData[];
  isLoading?: boolean;
}>;

export function LeavePlanSideBar({
  leavePlanId,
  leavePlanListData,
  isLoading = false,
}: LeavePlanSideBarProps) {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { control, watch } = useFormContext<leavePlanFormField>();

  const searchText = watch("searchText");

  const queryClient = useQueryClient();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddLeavePlanDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: leavePlanKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Box
      sx={{
        background: iron[600],
        borderRadius: "4px",
        width: "394px",
        height: "calc(95vh - 100px)",
      }}
    >
      <PadBox padding={{ padding: "20px" }}>
        <Stack gap="24px">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body1"
              fontWeight={500}
              sx={{ color: butterflyBlue[900] }}
            >
              Leave Plan
            </Typography>

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => onDialogOpen("add")}
            >
              Add Leave Plan
            </Button>
          </Stack>

          <Stack gap="20px">
            <CompanyAutocomplete control={control} name="company_id" />

            <SearchField name="searchText" control={control} />

            <Box
              sx={{
                height: "calc(85vh - 260px)",
                overflowY: "auto",
              }}
            >
              <PadBox padding={{ paddingRight: "10px" }}>
                <LeavePlanList
                  searchText={searchText}
                  leavePlanListData={leavePlanListData}
                  leavePlanId={leavePlanId}
                  isLoading={isLoading}
                />
              </PadBox>
            </Box>
          </Stack>
        </Stack>
      </PadBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Box>
  );
}
