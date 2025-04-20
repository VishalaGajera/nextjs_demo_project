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
import { EditLocationUnitDialog } from "./Dialogs/EditLocationUnitDialog/EditLocationUnitDialog";
import { LocationHistoryDialog } from "./Dialogs/LocationHistoryDialog/LocationHistoryDialog";

type LocationCardProps = {
  defaultValues?: EmployeeOrganizationDetails["business_unit_location"];
  loading: boolean;
  employeeId: string;
};

export const LocationCard = ({
  defaultValues,
  loading,
  employeeId,
}: LocationCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditLocationUnitDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeeOrganizationDetails.get(employeeId),
          });
        }}
      />
    ),

    history: (
      <LocationHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <>
      <Card
        heading="Location"
        action={
          <Stack direction="row">
            <HistoryAction onClick={() => onDialogOpen("history")} />
            <EditAction onClick={() => onDialogOpen("edit")} />
          </Stack>
        }
      >
        <CardItem
          label="Location "
          value={
            <CardItemValue title={defaultValues?.name} loading={loading} />
          }
        />
        <CardItem
          label="Effective From "
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
          label="Remark "
          value={
            <CardItemValue title={defaultValues?.remark} loading={loading} />
          }
        />
        <CardItem
          label="Action By "
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
