import { Button } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Divider, Stack, useTheme } from "@mui/material";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { BankHolidayList } from "./BankHolidayList/BankHolidayList";
import { AddBankHolidayYearDialog } from "./Dialog/AddBankHolidayYearDialog";
import { Tabs } from "./Tabs/Tabs";
import { useGetBankHolidayYearsList } from "./Tabs/hooks/useGetBankHolidayYearsList";

type BankHolidayRightModuleProps = {
  companyId: string;
};
export const BankHolidayRightModule = ({
  companyId,
}: BankHolidayRightModuleProps) => {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddBankHolidayYearDialog
        open
        onClose={onDialogClose}
        companyId={companyId}
      />
    ),
  };

  const { data: bankHolidayYears } = useGetBankHolidayYearsList({ companyId });

  const currentYear = new Date().getFullYear();

  const isAddYearDisabled =
    bankHolidayYears &&
    [currentYear - 1, currentYear, currentYear + 1].every((year) =>
      bankHolidayYears.some((item) => Number(item.year) === year)
    );

  return (
    <Stack gap="10px" bgcolor={lightBlue[50]} flexGrow={1}>
      <Stack paddingTop="10px">
        <Stack gap="10px" direction="row" alignItems="center">
          {bankHolidayYears && <Tabs bankHolidayYears={bankHolidayYears} />}

          <Button
            variant="outlined"
            startIcon={<Add />}
            sx={{ height: "38px" }}
            onClick={() => onDialogOpen("add")}
            disabled={isAddYearDisabled}
          >
            Add Year
          </Button>
        </Stack>

        <Divider />
      </Stack>

      {bankHolidayYears && (
        <BankHolidayList bankHolidayYears={bankHolidayYears} />
      )}

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
