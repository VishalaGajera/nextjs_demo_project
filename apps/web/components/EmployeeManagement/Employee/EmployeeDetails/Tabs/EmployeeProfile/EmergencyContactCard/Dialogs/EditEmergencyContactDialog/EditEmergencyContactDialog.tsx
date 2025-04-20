import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import _ from "lodash";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../../utils/errors";
import { EditAction } from "../../../../../../../../common/EditAction";
import { useGetEmergencyContact } from "../../hooks/useGetEmergencyContact";
import { useEditEmergencyContact } from "../hooks/useEditEmergencyContact";
import type {
  EmergencyContactFormFieldValues,
  FormRef,
} from "./EmergencyContactForm";
import { EmergencyContactForm } from "./EmergencyContactForm";

type EditEmergencyContactDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
};
export const EditEmergencyContactDialog = ({
  employeeId,
  open,
  onClose,
  onEditSuccess,
}: EditEmergencyContactDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: emergencyContactData, isPending: isPendingEmergencyContact } =
    useGetEmergencyContact({
      employeeId,
    });

  const { mutate, isPending } = useEditEmergencyContact({
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => {
        const errorObject = error.response.data.error;

        const modifyErrorKeys = (
          errorObj: Record<string, string>,
          mainKey: string
        ) => {
          return _.mapKeys(
            errorObj,
            (_value, subKey) => `${mainKey}_${subKey}`
          );
        };

        const formattedError: Record<string, string> = {
          ...modifyErrorKeys(errorObject["primary"], "primary"),
          ...modifyErrorKeys(errorObject["secondary"], "secondary"),
        };

        const structuredError = {
          response: {
            data: {
              message: error.response.data.message,
              error: formattedError as EmergencyContactFormFieldValues,
            },
          },
          status: error.status,
        };

        onError(structuredError, formRef.current?.setError);
      },
    },
  });

  const onEditEmergencyContact = () => {
    formRef.current?.submitForm((payloadData) => {
      mutate(payloadData);
    });
  };

  const defaultValues = useMemo(() => {
    if (emergencyContactData) {
      const emergencyContactFormFieldValues = {
        primary_name: emergencyContactData.primary.name,
        primary_relation: emergencyContactData.primary.relation,
        primary_mobile_no: emergencyContactData.primary.mobile_no,
        primary_address: emergencyContactData.primary.address,
        primary_email: emergencyContactData.primary.email,
        secondary_name: emergencyContactData.secondary.name,
        secondary_relation: emergencyContactData.secondary.relation,
        secondary_mobile_no: emergencyContactData.secondary.mobile_no,
        secondary_address: emergencyContactData.secondary.address,
        secondary_email: emergencyContactData.secondary.email,
      };

      return emergencyContactFormFieldValues;
    }
  }, [emergencyContactData]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Emergency Contact"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditEmergencyContact}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <EmergencyContactForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingEmergencyContact}
      />
    </Dialog>
  );
};
