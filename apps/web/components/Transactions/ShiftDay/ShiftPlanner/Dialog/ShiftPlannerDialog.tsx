import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import type { ShiftPlannerEditFields } from "../ShiftPlannerList/ShiftPlannerList";
import { useEditShiftPlanner } from "./hook/useEditShiftPlanner";
import type { FormRef, SlotsType } from "./ShiftPlannerForm";
import { ShiftPlannerForm } from "./ShiftPlannerForm";

type ShiftPlannerDialogProps = {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onEditSuccess: () => void;
  currentDate: string;
  shiftPlannerData: ShiftPlannerEditFields;
};
export const ShiftPlannerDialog = ({
  open,
  onClose,
  companyId,
  currentDate,
  shiftPlannerData,
  onEditSuccess,
}: ShiftPlannerDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { mutate, isPending } = useEditShiftPlanner({
    currentDate,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditShiftPlanner = () => {
    formRef.current?.submitForm((formValues) => {
      const slots: SlotsType[] = [{ ...shiftPlannerData }];

      mutate({ ...formValues, slots });
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Plan Shift"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction onClick={onEditShiftPlanner} loading={isPending} />
        </Stack>
      }
    >
      <ShiftPlannerForm
        ref={formRef}
        companyId={companyId}
        shiftPlannerData={shiftPlannerData}
      />
    </Dialog>
  );
};
