import { Button, PadBox } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import type { PageProps } from "../../../../../../../app/employee-management/employee/[employeeId]/page";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { AddInsuranceDetailDialog } from "./Dialogs/AddInsuranceDetailDialog";
import { InsuranceDetailList } from "./InsuranceDetailList/InsuranceDetailList";
type InsuranceDetailCardProps = Readonly<PageProps["params"]>;

export type InsuranceDetailsRef = {
  refreshInsuranceDetailsList: () => void;
};
export function InsuranceDetailCard({ employeeId }: InsuranceDetailCardProps) {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const insuranceDetailsRef = useRef<InsuranceDetailsRef>(null);

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddInsuranceDetailDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          insuranceDetailsRef.current?.refreshInsuranceDetailsList()
        }
        employeeId={employeeId}
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
            <Typography variant="subtitle1">Insurance Details</Typography>

            <Stack direction="row" gap="5px">
              <Button variant="outlined" onClick={() => onDialogOpen("add")}>
                <AddRoundedIcon
                  fontSize="small"
                  sx={{ color: butterflyBlue[900] }}
                />

                <Typography variant="body1" sx={{ color: butterflyBlue[900] }}>
                  Add Insurance
                </Typography>
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <InsuranceDetailList
          ref={insuranceDetailsRef}
          employeeId={employeeId}
        />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
