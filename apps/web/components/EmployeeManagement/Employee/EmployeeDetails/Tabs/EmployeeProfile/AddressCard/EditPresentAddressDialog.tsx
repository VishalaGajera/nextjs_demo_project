import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { onError } from "../../../../../../../utils/errors";

import { isFunction } from "lodash";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import type {
  EmployeeAddressFormFieldValues,
  FormRef,
} from "./EmployeeAddressForm";
import { EmployeeAddressForm } from "./EmployeeAddressForm";
import { useEditEmployeeAddress } from "./hooks/useEditEmployeeAddress";
import { useGetEmployeePresentAddress } from "./hooks/useGetEmployeePresentAddress";
import { EditAction } from "../../../../../../common/EditAction";

type EditPresentAddressDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
};

export const EditPresentAddressDialog = ({
  employeeId,
  open,
  onClose,
  onEditSuccess,
}: EditPresentAddressDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: addressData, isPending: isPendingAddressData } =
    useGetEmployeePresentAddress({
      employeeId,
      enabled: true,
    });

  const { mutate, isPending } = useEditEmployeeAddress({
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();

        if (isFunction(onEditSuccess)) {
          onEditSuccess();
        }

        toasts.success({ title: data.message });
      },
      onError: (error) => {
        const structuredError = {
          response: {
            data: {
              message: error.response.data.message,
              error: error.response.data.error
                .present as EmployeeAddressFormFieldValues,
            },
          },
          status: error.status,
        };

        onError(structuredError, formRef.current?.setError);
      },
    },
  });

  const onEditPersonalInformation = () => {
    formRef.current?.submitForm((payloadData) => {
      mutate({ present: { ...payloadData } });
    });
  };

  const defaultValues = useMemo(() => {
    if (addressData) {
      const employeeAddressFormFieldValues: EmployeeAddressFormFieldValues = {
        name: addressData.name,
        address: addressData.address,
        city_id: addressData.city_id,
        state_id: addressData.state_id,
        country_id: addressData.country_id,
        pin_code: addressData.pin_code,
        mobile_no: addressData.mobile_no,
        email: addressData.email,
      };

      return employeeAddressFormFieldValues;
    }
  }, [addressData]);

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Present Address"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            loading={isPending}
            onClick={onEditPersonalInformation}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <EmployeeAddressForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingAddressData}
      />
    </Dialog>
  );
};
