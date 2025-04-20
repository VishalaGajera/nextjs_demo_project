import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { useAddShift } from "../../hooks/useAddShift";
import { AutoShiftForm, type FormRef } from "../AutoShiftForm/AutoShiftForm";

export const AddAutoShift = () => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const onCancel = () => {
    router.push("/employee-management/shifts/shift");
  };

  const { mutate, isPending } = useAddShift({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        onCancel();
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onAddFixedShift = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Stack gap="15px">
      <AutoShiftForm ref={formRef} />

      <Stack direction="row" gap="15px" justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          onClick={onAddFixedShift}
          loading={isPending}
          disabled={isDisabled()}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};
