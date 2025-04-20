import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
  HistoryAction,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useDialogActions } from "../../../../../../../../../hooks/useDialogActions";
import { employeeSchemaDetails } from "../../../../../../../../../queryKeysFactories/employeeSchemaDetails";
import type { DialogRenderer } from "../../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../../utils/date";
import type { SchemaDetail } from "../hooks/useGetSchemaDetails";
import { EditLoanPolicyDialog } from "./Dialogs/EditLoanPolicyDialog/EditLoanPolicyDialog";
import { LoanPolicyHistoryDialog } from "./Dialogs/LoanPolicyHistoryDialog/LoanPolicyHistoryDialog";

type LoanPolicyCardProps = {
  employeeId: string;
  companyId: string;
  defaultValues?: SchemaDetail["loan_policy"];
  loading: boolean;
};

export const LoanPolicyCard = ({
  loading,
  employeeId,
  companyId,
  defaultValues,
}: LoanPolicyCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditLoanPolicyDialog
        open
        companyId={companyId}
        onClose={onDialogClose}
        employeeId={employeeId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeeSchemaDetails.get(employeeId),
          });
        }}
      />
    ),

    history: (
      <LoanPolicyHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <Card
      heading="Loan Policy"
      action={
        <Stack direction="row">
          <HistoryAction onClick={() => onDialogOpen("history")} />

          <EditAction onClick={() => onDialogOpen("edit")} />
        </Stack>
      }
    >
      <CardItem
        label="Loan Policy Name"
        value={
          <CardItemValue
            title={
              defaultValues?.name ??
              (defaultValues?.effective_from ? "No Policy Assigned" : "-")
            }
            loading={loading}
          />
        }
      />

      <CardItem
        label="Effective From"
        value={
          <CardItemValue
            title={
              defaultValues?.effective_from
                ? dateFormat(defaultValues?.effective_from, true)
                : ""
            }
            loading={loading}
          />
        }
      />

      <CardItem
        label="Effective Up To"
        value={
          <CardItemValue
            title={
              (defaultValues?.effective_to &&
                dateFormat(defaultValues.effective_to, true)) ??
              (defaultValues?.effective_from ? "No End Date Yet" : "-")
            }
            loading={loading}
          />
        }
      />

      <CardItem
        label="Remark"
        value={
          <CardItemValue title={defaultValues?.remark} loading={loading} />
        }
      />

      <CardItem
        label="Action By"
        value={
          <CardItemValue
            title={defaultValues?.action_by}
            loading={loading}
            subTitle={
              defaultValues?.action_at
                ? `On ${dateFormat(defaultValues?.action_at)}`
                : ""
            }
          />
        }
      />
      {openedDialog && dialogRenderer[openedDialog]}
    </Card>
  );
};
