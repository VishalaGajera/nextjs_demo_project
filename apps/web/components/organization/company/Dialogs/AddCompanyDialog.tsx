import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import _, { isFunction } from "lodash";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../utils/errors";
import type { CompanyFormFieldValues, FormRef } from "./CompanyForm";
import { CompanyForm } from "./CompanyForm";
import { useAddCompany } from "./hooks/useAddCompany";

type AddCompanyDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
};

export const AddCompanyDialog = ({
  open,
  onClose,
  onAddSuccess,
}: AddCompanyDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddCompany({
    options: {
      onSuccess: (data) => {
        onClose();

        if (isFunction(onAddSuccess)) {
          onAddSuccess();
        }

        toasts.success({ title: data.message });
      },
      onError: (error) => {
        const errorObject = error.response.data.error;

        const formattedError =
          _.merge(
            errorObject["basic_details"],
            errorObject["statutory_details"]
          ) ?? {};

        const structuredError = {
          response: {
            data: {
              message: error.response.data.message,
              error: formattedError as CompanyFormFieldValues,
            },
          },
          status: error.status,
        };

        onError(structuredError, formRef.current?.setError);
      },
    },
  });

  const onCreateCompany = () => {
    formRef.current?.submitForm((payloadData) => {
      mutate(payloadData);
    });
  };

  return (
    <Dialog
      maxWidth="xl"
      onClose={onClose}
      open={open}
      title="Add Company"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateCompany}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <CompanyForm ref={formRef} />
    </Dialog>
  );
};
