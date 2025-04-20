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
  AttendancePenaltyRuleForm,
  type AttendancePenaltyRuleFormFieldValues,
  type AttendancePenaltyRuleFormProps,
  type FormRef,
} from "./AttendancePenaltyRuleForm";

type EditAttendancePenaltyRuleDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const EditAttendancePenaltyRuleDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditAttendancePenaltyRuleDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: attendancePenaltyRuleDetails,
    isFetching: isPendingAttendanceDetails,
  } = useGetSectionSchemaDetail({
    employeeId,
    section: "attendance_penalty_rule",
  });

  const { operationType, menuItems } = useTabOptions({
    effectFrom: !!attendancePenaltyRuleDetails?.effective_from,
  });

  const { mutate, isPending } = useEditSchemaDetails({
    employeeId,
    section: "attendance_penalty_rule",
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: AttendancePenaltyRuleFormFieldValues =
          merge(error);

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
    if (attendancePenaltyRuleDetails) {
      const isAttendancePenaltyRuleId = attendancePenaltyRuleDetails.id
        ? false
        : true;

      const AttendancePenaltyRuleFormFieldValues: AttendancePenaltyRuleFormProps["defaultValues"] =
        {
          id: attendancePenaltyRuleDetails.id,
          effective_from: attendancePenaltyRuleDetails.effective_from,
          effective_to: attendancePenaltyRuleDetails.effective_to,
          has_no_end_date: attendancePenaltyRuleDetails.has_no_end_date,
          unassigned_rule: !attendancePenaltyRuleDetails.effective_from
            ? false
            : isAttendancePenaltyRuleId,
          remark: attendancePenaltyRuleDetails.remark,
          joining_date: attendancePenaltyRuleDetails.joining_date,
          operationType,
        };

      return AttendancePenaltyRuleFormFieldValues;
    }
  }, [attendancePenaltyRuleDetails]);

  const onEditAttendancePenaltyRule = () => {
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
      title="Edit Attendance Penalty Rule"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditAttendancePenaltyRule}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingAttendanceDetails}
      />

      <AttendancePenaltyRuleForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingAttendanceDetails}
        companyId={companyId}
      />
    </Dialog>
  );
};
