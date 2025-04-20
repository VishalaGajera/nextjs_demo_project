import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import type { FormRef } from "./MapLeavePlanTypeForm";
import { MapLeavePlanTypeForm } from "./MapLeavePlanTypeForm";
import { useAddMapLeavePlanType } from "./hooks/useAddMapLeavePlanType";
import { useGetLeavePlanTypeOptions } from "./hooks/useGetLeavePlanTypeOptions";

type AddMapLeavePlanTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  leavePlanId: string;
};

export const AddMapLeavePlanTypeDialog = ({
  open,
  onClose,
  leavePlanId,
  onAddSuccess,
}: AddMapLeavePlanTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: leaveTypeOptions, isFetching: leaveTypeOptionLoading } =
    useGetLeavePlanTypeOptions({ leavePlanId });

  const { mutate, isPending } = useAddMapLeavePlanType({
    leavePlanId,
    options: {
      onSuccess: (data) => {
        onClose();

        if (isFunction(onAddSuccess)) {
          onAddSuccess();
        }

        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onAddMapLeavePlanType = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    return {
      leave_type_ids: leaveTypeOptions.map((item) => {
        return {
          id: item.id,
          value: item.is_blocked,
          is_blocked: item.is_blocked,
        };
      }),
    };
  }, [leaveTypeOptions]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Map Leave Type to Plan"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={onAddMapLeavePlanType}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <MapLeavePlanTypeForm
        ref={formRef}
        leaveTypeOptions={leaveTypeOptions}
        leaveTypeOptionLoading={leaveTypeOptionLoading}
        defaultValues={defaultValues}
      />
    </Dialog>
  );
};
