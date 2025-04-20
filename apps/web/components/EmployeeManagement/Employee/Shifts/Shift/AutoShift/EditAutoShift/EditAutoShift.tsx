import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { employeeShiftDetailKeys } from "../../../../../../../queryKeysFactories/shift";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import { useGetShift } from "../../hooks/useGetShift";
import { useShiftEdit } from "../../hooks/useShiftEdit";
import { AutoShiftForm, type FormRef } from "../AutoShiftForm/AutoShiftForm";

type EditAutoShiftProps = {
  shiftId: string;
};
export const EditAutoShift = ({ shiftId }: EditAutoShiftProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: shiftDetail, isLoading: isShiftLoading } = useGetShift({
    shiftId,
  });

  const onCancel = () => {
    router.push("/employee-management/shifts/shift");
  };

  const { mutate, isPending } = useShiftEdit({
    shiftId,
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: employeeShiftDetailKeys.get(shiftId),
        });
        toasts.success({ title: data.message });
        onCancel();
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditShift = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Stack spacing={2}>
      <AutoShiftForm
        ref={formRef}
        defaultValues={shiftDetail}
        loading={isShiftLoading}
        isEdit={true}
      />

      <Stack direction="row" gap="15px" justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>

        <EditAction
          onClick={onEditShift}
          loading={isPending}
          disabled={isDisabled()}
        />
      </Stack>
    </Stack>
  );
};
