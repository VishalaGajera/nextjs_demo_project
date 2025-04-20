import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../utils/errors";
import { EditAction } from "../../../common/EditAction";
import {
  CompanyBankForm,
  type CompanyBankFormFieldValues,
  type FormRef,
} from "./CompanyBankForm";
import { useEditCompanyBank } from "./hooks/useEditCompanyBank";
import { useGetCompanyBank } from "./hooks/useGetCompanyBank";

type EditCompanyBankDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  companyBankId: string;
};

export const EditCompanyBankDialog = ({
  companyBankId,
  open,
  onClose,
  onEditSuccess,
}: EditCompanyBankDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: companyBank, isPending: isPendingLatestCompanyBank } =
    useGetCompanyBank({
      companyBankId,
    });

  const { mutate, isPending } = useEditCompanyBank({
    companyBankId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditLocation = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (companyBank) {
      const companyBankFormFieldValues: CompanyBankFormFieldValues = {
        company_id: companyBank.company_id,
        bank_id: companyBank.bank_id,
        branch_name: companyBank.branch_name,
        ifsc_code: companyBank.ifsc_code,
        account_no: companyBank.account_no,
      };

      return companyBankFormFieldValues;
    }
  }, [companyBank]);

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Company Bank"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditLocation}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <CompanyBankForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingLatestCompanyBank}
      />
    </Dialog>
  );
};
