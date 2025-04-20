import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { employeeShiftDetailKeys } from "../../../../../../../queryKeysFactories/shift";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import { useGetShift } from "../../hooks/useGetShift";
import { useShiftEdit } from "../../hooks/useShiftEdit";
import { FixedShiftForm, type FormRef } from "../AddFixedShift/FixedShiftForm";

type EditFixedShiftProps = {
  shiftId: string;
};
export const EditFixedShift = ({ shiftId }: EditFixedShiftProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: shiftDetail, isLoading: isShiftLoading } = useGetShift({
    shiftId,
  });

  const { mutate, isPending } = useShiftEdit({
    shiftId,
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: employeeShiftDetailKeys.get(shiftId),
        });
        toasts.success({ title: data.message });
        router.push("/employee-management/shifts/shift");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const defaultValues = useMemo(() => {
    if (shiftDetail) {
      const shiftFormValues = shiftDetail;

      return shiftFormValues;
    }
  }, [shiftDetail]);

  const onEditShift = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const onCancel = () => {
    router.push("/employee-management/shifts/shift");
  };

  return (
    <Stack spacing={2}>
      <FixedShiftForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isShiftLoading}
        isEditing={true}
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
