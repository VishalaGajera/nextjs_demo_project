import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { type FormRef } from "../../../../../EmployeeManagement/Holiday/HolidayRightModule/HolidayGroupList/Dialog/HolidayForm";
import { BankHolidayForm } from "./BankHolidayForm";
import { useEditBankHoliday } from "./hooks/useEditBankHoliday";
import { useGetBankHoliday } from "./hooks/useGetBankHoliday";

type EditBankHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  companyId: string;
  bankHolidayId: string;
  onEditSuccess: () => void;
  year: string;
};

export const EditBankHolidayDialog = ({
  open,
  onClose,
  companyId,
  bankHolidayId,
  onEditSuccess,
  year,
}: EditBankHolidayDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: bankHolidayData, isPending: isPendingBankHolidayData } =
    useGetBankHoliday({
      bankHolidayId,
      companyId,
    });

  const { mutate, isPending } = useEditBankHoliday({
    companyId,
    bankHolidayId,
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
    if (bankHolidayData) {
      return {
        holiday_date: bankHolidayData.holiday_date,
        holiday_name: bankHolidayData.holiday_name,
      };
    }
  }, [bankHolidayData]);

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
      title="Edit Bank Holiday"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            loading={isPending}
            disabled={isDisabled()}
          >
            Edit
          </Button>
        </Stack>
      }
    >
      <BankHolidayForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingBankHolidayData}
        isPreDefinedBankHoliday={bankHolidayData?.is_editable}
        year={year}
      />
    </Dialog>
  );
};
