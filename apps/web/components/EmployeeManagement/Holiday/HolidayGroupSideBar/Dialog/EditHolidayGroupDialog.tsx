import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { holidayGroupKeys } from "../../../../../queryKeysFactories/holiday";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import { useGetHolidayGroup } from "../../Dialog/hooks/useGetHolidayGroup";
import type { FormRef } from "./EditHolidayGroupForm";
import { EditHolidayGroupForm } from "./EditHolidayGroupForm";
import { useEditHolidaysGroup } from "./hooks/useEditHolidayGroup";

type EditHolidayGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  holidayGroupId: string;
};

export const EditHolidayGroupDialog = ({
  open,
  onClose,
  holidayGroupId,
}: EditHolidayGroupDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: holidayGroup, isPending: isPendingHolidayGroupData } =
    useGetHolidayGroup({ holidayGroupId });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useEditHolidaysGroup({
    holidayGroupId,
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: holidayGroupKeys.listing(),
        });
        toasts.success({ title: data.message });
        onClose();
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const handleSubmit = () => {
    formRef.current?.submitForm((formValues) => {
      const payload = {
        holiday_group_name: formValues.holiday_group_name,
      };

      mutate(payload);
    });
  };

  const defaultValues = useMemo(() => {
    if (holidayGroup) {
      const EditHolidayGroupFormFieldValues = {
        holiday_group_name: holidayGroup.holiday_group_name,
      };

      return EditHolidayGroupFormFieldValues;
    }
  }, [holidayGroup]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Holiday Group"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={handleSubmit}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <EditHolidayGroupForm
        ref={formRef}
        loading={isPendingHolidayGroupData}
        defaultValues={defaultValues}
      />
    </Dialog>
  );
};
