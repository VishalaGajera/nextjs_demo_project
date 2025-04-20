import {
  Button,
  dateFormats,
  Dialog,
  Tabs,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { merge } from "lodash";
import { DateTime } from "luxon";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../../../../utils/errors";
import { EditAction } from "../../../../../../../../../../common/EditAction";
import { useTabOptions } from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import {
  type EditSchemaPayload,
  useEditSchemaDetails,
} from "../../../hooks/useEditSchemaDetails";
import { useGetSectionSchemaDetail } from "../../../hooks/useGetSectionSchemaDetails";
import {
  type EditBankShiftFormFieldValues,
  type EditBankShiftFormProps,
  type FormRef,
  EditBankShiftForm,
} from "./EditBankShiftForm";

type EditBankShiftDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const EditBankShiftDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditBankShiftDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { operationType, menuItems } = useTabOptions({});

  const { data: bankShiftTypeDetails, isFetching: isPendingBankShiftDetail } =
    useGetSectionSchemaDetail({ employeeId, section: "bank_shift_type" });

  const { mutate, isPending } = useEditSchemaDetails({
    employeeId,
    section: "bank_shift_type",
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: EditBankShiftFormFieldValues = merge(error);

        const structuredError = {
          response: {
            data: {
              message,
              error: formattedError,
            },
          },
          status: res.status,
        };

        onError(structuredError, formRef.current?.setError);
      },
    },
  });

  const defaultValues = useMemo(() => {
    if (bankShiftTypeDetails) {
      const bankShiftFormFieldValues: EditBankShiftFormProps["defaultValues"] =
        {
          id: bankShiftTypeDetails.id,
          weekly_off: bankShiftTypeDetails.weekly_off,
          effective_from: bankShiftTypeDetails.effective_from,
          effective_to: bankShiftTypeDetails.effective_to,
          has_no_end_date: bankShiftTypeDetails.has_no_end_date,
          remark: bankShiftTypeDetails.remark,
          joining_date: bankShiftTypeDetails.joining_date,
          operationType,
        };

      return bankShiftFormFieldValues;
    }
  }, [bankShiftTypeDetails]);

  const onEditBankShift = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditSchemaPayload = {
        id: formValues.id,
        weekly_off: formValues.weekly_off,
        remark: formValues.remark,
        has_no_end_date: formValues.has_no_end_date,
        effective_from:
          formValues?.effective_from &&
          DateTime.fromISO(formValues.effective_from).toFormat(
            dateFormats.dateWithISO8601
          ),
        effective_to:
          formValues?.effective_to &&
          DateTime.fromISO(formValues.effective_to).toFormat(
            dateFormats.dateWithISO8601
          ),
      };

      mutate(payload);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Bank Shift"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditBankShift}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingBankShiftDetail}
      />

      <EditBankShiftForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingBankShiftDetail}
        companyId={companyId}
      />
    </Dialog>
  );
};
