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
import { employeeOrganizationDetails } from "../../../../../../../../../queryKeysFactories/employeeOrganizationDetails";
import type { DialogRenderer } from "../../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../../utils/date";
import type { EmployeeOrganizationDetails } from "../hooks/useGetOrganizationDetails";
import { BusinessUnitHistoryDialog } from "./Dialogs/BusinessUnitHistoryDialog/BusinessUnitHistoryDialog";
import { EditBusinessUnitDialog } from "./Dialogs/EditBusinessUnitDialog/EditBusinessUnitDialog";

type BusinessUnitCardProps = {
  defaultValues?: EmployeeOrganizationDetails["business_unit"];
  loading: boolean;
  employeeId: string;
  companyId: string;
};

export const BusinessUnitCard = ({
  defaultValues,
  loading,
  employeeId,
  companyId,
}: BusinessUnitCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditBusinessUnitDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
        companyId={companyId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeeOrganizationDetails.get(employeeId),
          });
        }}
      />
    ),
    history: (
      <BusinessUnitHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <>
      <Card
        heading="Business Unit"
        action={
          <Stack direction="row">
            <HistoryAction onClick={() => onDialogOpen("history")} />
            <EditAction onClick={() => onDialogOpen("edit")} />
          </Stack>
        }
      >
        <CardItem
          label="Business Unit"
          value={
            <CardItemValue title={defaultValues?.name} loading={loading} />
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
      </Card>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
