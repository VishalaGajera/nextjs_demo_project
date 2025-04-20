import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
  HistoryAction,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { capitalize } from "lodash";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { EditPaymentDetailsDialog } from "./Dialog/EditPaymentDetailsDialog/EditPaymentDetailsDialog";
import { useGetPaymentDetails } from "./Dialog/EditPaymentDetailsDialog/hooks/useGetPaymentDetails";
import { PaymentHistoryDialog } from "./Dialog/PaymentDetailsHistoryDialog/PaymentHistoryDialog";

type PaymentDetailsCardProps = {
  employeeId: string;
};

export const PaymentDetailsCard = ({ employeeId }: PaymentDetailsCardProps) => {
  const { data: BankInformation, isPending: loading } = useGetPaymentDetails({
    employeeId,
  });

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditPaymentDetailsDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
    history: (
      <PaymentHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <Card
      heading="Payment Details"
      action={
        <Stack direction="row">
          <HistoryAction onClick={() => onDialogOpen("history")} />
          <EditAction onClick={() => onDialogOpen("edit")} />
        </Stack>
      }
    >
      <Stack direction="row" gap="40px">
        <Stack width="468px" gap="10px">
          <CardItem
            label="Payment Type"
            value={
              <CardItemValue
                title={capitalize(BankInformation?.payment_type)}
                loading={loading}
              />
            }
          />
          <CardItem
            label="Bank Name"
            value={
              <CardItemValue
                title={BankInformation?.bank_name}
                loading={loading}
              />
            }
          />
          <CardItem
            label="Bank Branch"
            value={
              <CardItemValue
                title={capitalize(BankInformation?.branch_name)}
                loading={loading}
              />
            }
          />
        </Stack>
        <Stack width="436px" gap="10px">
          <CardItem
            label="Account No"
            value={
              <CardItemValue
                title={BankInformation?.account_no}
                loading={loading}
              />
            }
          />
          <CardItem
            label="Account Type"
            value={
              <CardItemValue
                title={capitalize(BankInformation?.account_type)}
                loading={loading}
              />
            }
          />
        </Stack>
        <Stack width="436px" gap="10px">
          <CardItem
            label="Name As Per Bank"
            value={
              <CardItemValue
                title={capitalize(BankInformation?.name_as_per_bank)}
                loading={loading}
              />
            }
          />
          <CardItem
            label="IFSC Code"
            value={
              <CardItemValue
                title={BankInformation?.ifsc_code}
                loading={loading}
              />
            }
          />
        </Stack>
      </Stack>
      {openedDialog && dialogRenderer[openedDialog]}
    </Card>
  );
};
