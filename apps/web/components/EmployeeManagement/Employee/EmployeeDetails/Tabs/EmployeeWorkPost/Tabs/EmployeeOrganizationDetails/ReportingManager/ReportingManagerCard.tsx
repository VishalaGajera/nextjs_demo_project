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
import { employeeBasicDetailsKeys } from "../../../../../../../../../queryKeysFactories/employee";
import { employeeOrganizationDetails } from "../../../../../../../../../queryKeysFactories/employeeOrganizationDetails";
import type { DialogRenderer } from "../../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../../utils/date";
import type { EmployeeOrganizationDetails } from "../hooks/useGetOrganizationDetails";
import { EditReportingManagerDialog } from "./Dialogs/EditReportingManagerDialog/EditReportingManagerDialog";
import { ReportingManagerHistoryDialog } from "./Dialogs/ReportingManagerHistoryDialog/ReportingManagerHistoryDialog";

type ReportingManagerCardProps = {
  defaultValues?: EmployeeOrganizationDetails["reporting_manager"];
  employeeId: string;
  companyId: string;
  loading: boolean;
};

export const ReportingManagerCard = ({
  defaultValues,
  employeeId,
  companyId,
  loading,
}: ReportingManagerCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditReportingManagerDialog
        open
        onClose={onDialogClose}
        companyId={companyId}
        employeeId={employeeId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeeOrganizationDetails.get(employeeId),
          });
          queryClient.invalidateQueries({
            queryKey: employeeBasicDetailsKeys.get(employeeId),
          });
        }}
      />
    ),
    history: (
      <ReportingManagerHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <Card
      heading="Reporting Manager"
      action={
        <Stack direction="row">
          <HistoryAction onClick={() => onDialogOpen("history")} />
          <EditAction onClick={() => onDialogOpen("edit")} />
        </Stack>
      }
    >
      <CardItem
        label="Reporting Manager"
        value={<CardItemValue title={defaultValues?.name} loading={loading} />}
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
