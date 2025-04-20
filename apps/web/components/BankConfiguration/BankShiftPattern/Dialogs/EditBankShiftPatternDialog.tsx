import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { onError } from "../../../../utils/errors";
import { EditAction } from "../../../common/EditAction";
import {
  BankShiftPatternForm,
  type BankShiftPatternFormFieldValues,
  type FormRef,
} from "./BankShiftPatternForm";
import { useEditBankShiftPattern } from "./hooks/useEditBankShiftPattern";
import { useGetBankShiftPattern } from "./hooks/useGetBankShiftPattern";

type EditBankShiftPatternDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  bankShiftPatternId: string;
};
export const EditBankShiftPatternDialog = ({
  bankShiftPatternId,
  open,
  onClose,
  onEditSuccess,
}: EditBankShiftPatternDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const {
    data: latestBankShiftPatternData,
    isPending: isPendingBankShiftPatternData,
  } = useGetBankShiftPattern({
    bankShiftPatternId,
  });

  const { mutate, isPending } = useEditBankShiftPattern({
    bankShiftPatternId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const onEditBankShiftPattern = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (latestBankShiftPatternData) {
      const bankShiftPatternFormFieldValues: BankShiftPatternFormFieldValues = {
        ...latestBankShiftPatternData,
        configurations: Array.isArray(latestBankShiftPatternData.configurations)
          ? latestBankShiftPatternData.configurations.map((config) =>
              typeof config === "string"
                ? { shift: config }
                : { shift: config?.shift ?? null }
            )
          : [],
      };

      return bankShiftPatternFormFieldValues;
    }
  }, [latestBankShiftPatternData]);

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Bank Shift Pattern"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <EditAction onClick={onEditBankShiftPattern} loading={isPending} />
        </Stack>
      }
    >
      <BankShiftPatternForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingBankShiftPatternData}
      />
    </Dialog>
  );
};
