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
import { EditOvertimeRuleDialog } from "./Dialogs/EditOvertimeRuleDialog/EditOvertimeRuleDialog";
import { OvertimeRuleHistoryDialog } from "./Dialogs/OvertimeRuleHistoryDialog/OvertimeRuleHistoryDialog";

type OvertimeRuleCardProps = {
  companyId: string;
  employeeId: string;
  defaultValues?: SchemaDetail["overtime_rule"];
  loading: boolean;
};

export const OvertimeRuleCard = ({
  loading,
  companyId,
  employeeId,
  defaultValues,
}: OvertimeRuleCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditOvertimeRuleDialog
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
      <OvertimeRuleHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <Card
      heading="Overtime Rule"
      action={
        <Stack direction="row">
          <HistoryAction onClick={() => onDialogOpen("history")} />

          <EditAction onClick={() => onDialogOpen("edit")} />
        </Stack>
      }
    >
      <CardItem
        label="Overtime Rule Name"
        value={
          <CardItemValue
            title={
              defaultValues?.name
                ? defaultValues?.name
                : // eslint-disable-next-line sonarjs/no-nested-conditional
                  defaultValues?.effective_from
                  ? "No Rule Assigned"
                  : "-"
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
              defaultValues?.effective_to
                ? dateFormat(defaultValues?.effective_to, true)
                : // eslint-disable-next-line sonarjs/no-nested-conditional
                  defaultValues?.effective_from
                  ? "No End Date Yet"
                  : "-"
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
