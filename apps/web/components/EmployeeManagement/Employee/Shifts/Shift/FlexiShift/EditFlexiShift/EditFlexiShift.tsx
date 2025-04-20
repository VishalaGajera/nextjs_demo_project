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
import { useShiftEdit } from "../../hooks/useShiftEdit";
import { FlexiShiftForm, type FormRef } from "../AddFlexiShift/FlexiShiftForm";
import { useGetFlexiShift } from "./hooks/useGetFlexiShift";

type EditFlexiShiftProps = {
  shiftId: string;
};
export const EditFlexiShift = ({ shiftId }: EditFlexiShiftProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: shiftDetail, isLoading: isShiftLoading } = useGetFlexiShift({
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
      <FlexiShiftForm
        ref={formRef}
        defaultValues={shiftDetail}
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
