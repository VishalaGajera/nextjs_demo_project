import {
  Button,
  dateFormats,
  Dialog,
  Tabs,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../../../../utils/errors";
import { EditAction } from "../../../../../../../../../../common/EditAction";
import {
  type EditOrganizationDetailPayload,
  useEditOrganizationDetails,
} from "../../../hooks/useEditOrganizationDetails";
import { useGetEmployeeOrganizationSectionDetail } from "../../../hooks/useGetOrganizationSectionDetail";
import type { BusinessUnitFormProps, FormRef } from "./BusinessUnitForm";
import { BusinessUnitForm } from "./BusinessUnitForm";
import { useTabOptions } from "./hooks/useTabOptions";

type EditBusinessUnitDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const EditBusinessUnitDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditBusinessUnitDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { operationType, menuItems } = useTabOptions({});

  const { data: businessUnitDetails, isFetching: isPendingBusinessUnit } =
    useGetEmployeeOrganizationSectionDetail({
      employeeId,
      section: "business_unit",
    });

  const {
    data: businessLocationUnitDetails,
    isFetching: isPendingBusinessUnitLocation,
  } = useGetEmployeeOrganizationSectionDetail({
    employeeId,
    section: "business_unit_location",
  });

  const { mutate, isPending } = useEditOrganizationDetails({
    employeeId,
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => onError(error, formRef.current?.setError),
    },
  });

  const defaultValues = useMemo(() => {
    if (businessUnitDetails && businessLocationUnitDetails) {
      const businessUnitFormFieldValues: BusinessUnitFormProps["defaultValues"] =
        {
          business_unit: {
            id: businessUnitDetails.id,
            effective_from: businessUnitDetails.effective_from,
            remark: businessUnitDetails.remark,
          },
          business_unit_location: {
            id: businessLocationUnitDetails.id,
            effective_from: businessLocationUnitDetails.effective_from,
            remark: businessLocationUnitDetails.remark,
          },
          joining_date: businessUnitDetails.joining_date,
          operationType,
        };

      return businessUnitFormFieldValues;
    }
  }, [businessUnitDetails, businessLocationUnitDetails]);

  const onEditBusinessUnit = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditOrganizationDetailPayload = {
        business_unit: {
          id: formValues.business_unit?.id,
          remark: formValues.business_unit?.remark,
          effective_from:
            formValues?.business_unit?.effective_from &&
            DateTime.fromISO(formValues.business_unit.effective_from).toFormat(
              dateFormats.dateWithISO8601
            ),
        },
        business_unit_location: {
          id: formValues.business_unit_location?.id,
          effective_from:
            formValues.business_unit?.effective_from &&
            DateTime.fromISO(formValues.business_unit.effective_from).toFormat(
              dateFormats.dateWithISO8601
            ),
          remark: formValues.business_unit?.remark,
        },
      };

      mutate(payload);
    });
  };

  return (
    <Dialog
      maxWidth="md"
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
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingBusinessUnit || isPendingBusinessUnitLocation}
      />

      <BusinessUnitForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingBusinessUnit || isPendingBusinessUnitLocation}
        companyId={companyId}
      />
    </Dialog>
  );
};
