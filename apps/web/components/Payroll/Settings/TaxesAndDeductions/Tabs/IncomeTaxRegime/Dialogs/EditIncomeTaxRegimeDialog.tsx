import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import { IncomeTaxRegimeForm, type FormRef } from "../IncomeTaxRegimeForm";
import { useEditIncomeTaxRegime } from "../hooks/useEditIncomeTaxRegime";
import { useGetIncomeTaxRegime } from "../hooks/useGetIncomeTaxRegime";

type EditIncomeTaxRegimeDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  incomeTaxRegimeId: string;
};

export const EditIncomeTaxRegimeDialog = ({
  incomeTaxRegimeId,
  open,
  onEditSuccess,
  onClose,
}: EditIncomeTaxRegimeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: incomeTaxRegime, isPending: isPendingIncomeTaxRegimeData } =
    useGetIncomeTaxRegime({
      incomeTaxRegimeId,
    });

  const { mutate, isPending } = useEditIncomeTaxRegime({
    incomeTaxRegimeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditIncomeTaxRegime = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    return {
      ...incomeTaxRegime,
      financial_year: `${incomeTaxRegime?.financial_year.start_date} | ${incomeTaxRegime?.financial_year.end_date}`,
    };
  }, [incomeTaxRegime]);

  return (
    <Dialog
      maxWidth="xl"
      onClose={onClose}
      open={open}
      title="Edit Income Tax Regime"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditIncomeTaxRegime}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <IncomeTaxRegimeForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingIncomeTaxRegimeData}
        type="edit"
      />
    </Dialog>
  );
};
