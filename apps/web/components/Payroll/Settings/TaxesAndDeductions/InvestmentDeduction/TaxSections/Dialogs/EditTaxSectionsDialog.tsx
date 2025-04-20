import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import type { FormRef } from "./TaxSectionsForm";
import { TaxSectionsForm } from "./TaxSectionsForm";
import { useEditTaxSections } from "./hooks/useEditTaxSections";
import { useGetTaxSections } from "./hooks/useGetTaxSections";

type EditTaxSectionsDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  taxSectionsId: string;
};

export const EditTaxSectionsDialog = ({
  taxSectionsId,
  open,
  onEditSuccess,
  onClose,
}: EditTaxSectionsDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: taxSectionsData, isPending: isPendingTaxSectionsData } =
    useGetTaxSections({ taxSectionsId });

  const { mutate, isPending } = useEditTaxSections({
    taxSectionsId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditTaxSections = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Tax Sections"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditTaxSections}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <TaxSectionsForm
        ref={formRef}
        defaultValues={taxSectionsData}
        loading={isPendingTaxSectionsData}
        dialogType="edit"
      />
    </Dialog>
  );
};
