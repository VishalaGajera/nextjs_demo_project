import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
  HistoryAction,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import { employeePostDetails } from "../../../../../../../../../queryKeysFactories/employeePostDetails";

import { useDialogActions } from "../../../../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../../utils/date";
import type { PostItemDetail } from "../hooks/useGetPostDetails";
import { DepartmentHistoryDialog } from "./Dialogs/DepartmentHistoryDialog/DepartmentHistoryDialog";
import { EditDepartmentDialog } from "./Dialogs/EditDepartmentDialog/EditDepartmentDialog";

type DepartmentCardProps = {
  defaultValues?: PostItemDetail;
  loading: boolean;
  employeeId: string;
  companyId: string;
};
export const DepartmentCard = ({
  defaultValues,
  loading,
  employeeId,
  companyId,
}: DepartmentCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditDepartmentDialog
        open
        companyId={companyId}
        onClose={onDialogClose}
        employeeId={employeeId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeePostDetails.get(employeeId),
          });
        }}
      />
    ),
    history: (
      <DepartmentHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <>
      <Card
        heading="Department"
        action={
          <Stack direction="row">
            <HistoryAction onClick={() => onDialogOpen("history")} />
            <EditAction onClick={() => onDialogOpen("edit")} />
          </Stack>
        }
      >
        <CardItem
          label="Department"
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
