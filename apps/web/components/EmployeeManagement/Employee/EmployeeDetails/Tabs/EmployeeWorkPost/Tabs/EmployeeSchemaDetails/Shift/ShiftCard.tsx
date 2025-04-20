import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
  getTimeInHHmm,
  HistoryAction,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useDialogActions } from "../../../../../../../../../hooks/useDialogActions";
import { employeeSchemaDetails } from "../../../../../../../../../queryKeysFactories/employeeSchemaDetails";
import { type DialogRenderer } from "../../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../../utils/date";
import { getShiftTypeLabel } from "../../../../../../../../common/Autocomplete/ShiftSchemeAutocomplete";
import type { SchemaDetail } from "../hooks/useGetSchemaDetails";
import { EditShiftDialog } from "./Dialogs/EditShiftDialog/EditShiftDialog";
import { ShiftHistoryDialog } from "./Dialogs/ShiftHistoryDialog/ShiftHistoryDialog";

type ShiftCardProps = {
  employeeId: string;
  companyId: string;
  defaultValues?: SchemaDetail["shift_type"];
  loading: boolean;
};

export const ShiftCard = ({
  loading,
  employeeId,
  companyId,
  defaultValues,
}: ShiftCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditShiftDialog
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
      <ShiftHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <Card
      heading="Shift"
      action={
        <Stack direction="row">
          <HistoryAction onClick={() => onDialogOpen("history")} />
          <EditAction onClick={() => onDialogOpen("edit")} />
        </Stack>
      }
    >
      <CardItem
        label="Shift Name"
        value={
          <CardItemValue
            title={`${defaultValues?.name} (${getShiftTypeLabel(defaultValues?.shift_type ?? "")}) (${getTimeInHHmm(defaultValues?.shift_start ?? "ˀ")} - ${getTimeInHHmm(defaultValues?.shift_end ?? "")})`}
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
                : "No End Date Yet"
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
