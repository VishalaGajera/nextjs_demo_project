import {
  Button,
  Dialog,
  FormContainer,
  FormSection,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { bankKeys } from "../../../../../../../../../queryKeysFactories/bank";
import { onError } from "../../../../../../../../../utils/errors";
import { EditAction } from "../../../../../../../../common/EditAction";
import {
  BankInfoForm,
  type BankInfoFormFieldValues,
  type FormRef,
} from "../../../../../../AddEmployee/BankInfoForm";
import { useEditPaymentDetails } from "./hooks/useEditPaymentDetails";
import { useGetPaymentDetails } from "./hooks/useGetPaymentDetails";

type EditPaymentDetailsDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const EditPaymentDetailsDialog = ({
  onClose,
  open,
  employeeId,
}: EditPaymentDetailsDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { data: BankInformation, isFetching: loading } = useGetPaymentDetails({
    employeeId,
  });

  const defaultValues = useMemo(() => {
    if (BankInformation) {
      const businessUnitFormFieldValues: BankInfoFormFieldValues = {
        account_no: BankInformation.account_no,
        name_as_per_bank: BankInformation.name_as_per_bank,
        branch_name: BankInformation.branch_name,
        account_type: BankInformation.account_type,
        ifsc_code: BankInformation.ifsc_code,
        payment_type: BankInformation.payment_type,
        bank_id: BankInformation.bank_id,
      };

      return businessUnitFormFieldValues;
    }
  }, [BankInformation]);

  const queryClient = useQueryClient();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useEditPaymentDetails({
    bankId: employeeId,
    options: {
      onSuccess: (data) => {
        onClose();
        queryClient.invalidateQueries({
          queryKey: bankKeys.get(employeeId),
        });
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const editBankDetails = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Payment Details"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={editBankDetails}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <FormContainer>
        <FormSection>
          <BankInfoForm
            ref={formRef}
            loading={loading}
            defaultValues={defaultValues}
          />
        </FormSection>
      </FormContainer>
    </Dialog>
  );
};
