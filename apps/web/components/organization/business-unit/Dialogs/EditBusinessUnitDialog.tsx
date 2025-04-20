import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../utils/errors";
import { EditAction } from "../../../common/EditAction";
import {
  BusinessUnitForm,
  type BusinessUnitFormFieldValues,
  type FormRef,
} from "./BusinessUnitForm";
import { useEditBusinessUnit } from "./hooks/useEditBusinessUnit";
import { useGetBusinessUnit } from "./hooks/useGetBusinessUnit";

type EditBusinessUnitDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  businessUnitId: string;
};

export const EditBusinessUnitDialog = ({
  businessUnitId,
  open,
  onClose,
  onEditSuccess,
}: EditBusinessUnitDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: businessUnit, isPending: isPendingLatestBusinessUnit } =
    useGetBusinessUnit({
      businessUnitId,
    });

  const { mutate, isPending } = useEditBusinessUnit({
    businessUnitId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditBusinessUnit = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (businessUnit) {
      const businessUnitFormFieldValues: BusinessUnitFormFieldValues = {
        company_id: businessUnit.company_id,
        business_unit_name: businessUnit.business_unit_name,
        email: businessUnit.email,
        unit_license_no: businessUnit.unit_license_no,
        phone_no: businessUnit.phone_no,
        mobile_no: businessUnit.mobile_no,
        address: businessUnit.address,
        city_id: businessUnit.city_id,
        state_id: businessUnit.state_id,
        country_id: businessUnit.country_id,
        pin_code: businessUnit.pin_code,
        business_unit_heads: businessUnit.business_unit_heads,
      };

      return businessUnitFormFieldValues;
    }
  }, [businessUnit]);

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Business Unit"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditBusinessUnit}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <BusinessUnitForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingLatestBusinessUnit}
      />
    </Dialog>
  );
};
