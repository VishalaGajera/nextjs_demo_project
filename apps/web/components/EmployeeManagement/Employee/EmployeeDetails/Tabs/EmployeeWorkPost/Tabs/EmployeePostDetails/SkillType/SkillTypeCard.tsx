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
import { employeePostDetails } from "../../../../../../../../../queryKeysFactories/employeePostDetails";
import type { DialogRenderer } from "../../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../../utils/date";
import type { PostItemDetail } from "../hooks/useGetPostDetails";
import { EditSkillTypeDialog } from "./Dialogs/EditSkillTypeDialog/EditSkillTypeDialog";
import { SkillTypeHistoryDialog } from "./Dialogs/SkillTypeHistoryDialog/SkillTypeHistoryDialog";

type SkillTypeCardProps = {
  defaultValues?: PostItemDetail;
  loading: boolean;
  employeeId: string;
  companyId: string;
};
export const SkillTypeCard = ({
  defaultValues,
  loading,
  employeeId,
  companyId,
}: SkillTypeCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    history: (
      <SkillTypeHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
    edit: (
      <EditSkillTypeDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
        companyId={companyId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeePostDetails.get(employeeId),
          });
        }}
      />
    ),
  };

  return (
    <Card
      heading="Skill Type"
      action={
        <Stack direction="row">
          <HistoryAction onClick={() => onDialogOpen("history")} />
          <EditAction onClick={() => onDialogOpen("edit")} />
        </Stack>
      }
    >
      <CardItem
        label="Skill Type"
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
