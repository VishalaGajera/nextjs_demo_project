import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import { useEditInvestmentSchemes } from "./hooks/useEditInvestmentSchemes";
import { useGetInvestmentSchemes } from "./hooks/useGetInvestmentSchemes";
import type { FormRef } from "./InvestmentSchemesForm";
import { InvestmentSchemesForm } from "./InvestmentSchemesForm";

type EditInvestmentSchemesDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  investmentSchemesId: string;
};

export const EditInvestmentSchemesDialog = ({
  investmentSchemesId,
  open,
  onEditSuccess,
  onClose,
}: EditInvestmentSchemesDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: investmentSchemesData,
    isPending: isPendingInvestmentSchemesData,
  } = useGetInvestmentSchemes({ investmentSchemesId });

  const { mutate, isPending } = useEditInvestmentSchemes({
    investmentSchemesId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditInvestmentSchemes = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Investment Schemes"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditInvestmentSchemes}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <InvestmentSchemesForm
        ref={formRef}
        defaultValues={investmentSchemesData}
        loading={isPendingInvestmentSchemesData}
        dialogType="edit"
      />
    </Dialog>
  );
};
