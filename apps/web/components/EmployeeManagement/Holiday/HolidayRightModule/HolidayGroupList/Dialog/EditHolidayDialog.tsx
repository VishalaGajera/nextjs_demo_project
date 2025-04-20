import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { EditAction } from "../../../../../common/EditAction";
import { HolidayForm, type FormRef } from "./HolidayForm";
import { useEditHoliday } from "./hooks/useEditHoliday";
import { useGetHoliday } from "./hooks/useGetHoliday";

type EditHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  holidayGroupId: string;
  holidayId: string;
  onEditSuccess: () => void;
  year: string;
};

export const EditHolidayDialog = ({
  open,
  onClose,
  holidayGroupId,
  holidayId,
  onEditSuccess,
  year,
}: EditHolidayDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: holidayData, isPending: isPendingHolidayData } = useGetHoliday({
    holidayId,
    holidayGroupId,
  });

  const { mutate, isPending } = useEditHoliday({
    holidayGroupId,
    holidayId,
    options: {
      onSuccess: (data) => {
        onEditSuccess();
        toasts.success({ title: data.message });
        onClose();
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const defaultValues = useMemo(() => {
    if (holidayData) {
      return {
        holiday_date: holidayData.holiday_date,
        holiday_name: holidayData.holiday_name,
      };
    }
  }, [holidayData]);

  const handleSubmit = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Holiday"
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
      <HolidayForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingHolidayData}
        isPreDefinedHoliday={holidayData?.is_editable}
        year={year}
      />
    </Dialog>
  );
};
