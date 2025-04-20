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
  type EditOvertimeRuleFormFieldValues,
  type EditOvertimeRuleFormProps,
  type FormRef,
  EditOvertimeRuleForm,
} from "./EditOvertimeRuleForm";

type EditOvertimeRuleDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const EditOvertimeRuleDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditOvertimeRuleDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: overtimeRuleDetails,
    isFetching: isPendingOvertimeRuleDetails,
  } = useGetSectionSchemaDetail({
    employeeId,
    section: "overtime_rule",
  });

  const { operationType, menuItems } = useTabOptions({
    effectFrom: !!overtimeRuleDetails?.effective_from,
  });

  const { mutate, isPending } = useEditSchemaDetails({
    employeeId,
    section: "overtime_rule",
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: EditOvertimeRuleFormFieldValues = merge(error);

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
    if (overtimeRuleDetails) {
      const isOvertimeRuleId = overtimeRuleDetails.id ? false : true;

      const EditOvertimeRuleFormFieldValues: EditOvertimeRuleFormProps["defaultValues"] =
        {
          id: overtimeRuleDetails.id,
          effective_from: overtimeRuleDetails.effective_from,
          effective_to: overtimeRuleDetails.effective_to,
          has_no_end_date: overtimeRuleDetails.has_no_end_date,
          unassigned_rule: !overtimeRuleDetails.effective_from
            ? false
            : isOvertimeRuleId,
          remark: overtimeRuleDetails.remark,
          joining_date: overtimeRuleDetails.joining_date,
          operationType,
        };

      return EditOvertimeRuleFormFieldValues;
    }
  }, [overtimeRuleDetails]);

  const onEditOvertimeRule = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditSchemaPayload = {
        id: formValues.id,
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
      title="Edit Overtime Rule"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditOvertimeRule}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingOvertimeRuleDetails}
      />

      <EditOvertimeRuleForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingOvertimeRuleDetails}
        companyId={companyId}
      />
    </Dialog>
  );
};
