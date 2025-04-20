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
import { useTabOptions } from "../../../BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import {
  type EditOrganizationDetailPayload,
  useEditOrganizationDetails,
} from "../../../hooks/useEditOrganizationDetails";
import { useGetEmployeeOrganizationSectionDetail } from "../../../hooks/useGetOrganizationSectionDetail";
import type {
  FormRef,
  ReportingManagerFormFieldValues,
  ReportingManagerFormProps,
} from "./ReportingManagerForm";
import { ReportingManagerForm } from "./ReportingManagerForm";

type EditReportingManagerDialogProps = {
  open: boolean;
  onClose: () => void;
  companyId: string;
  employeeId: string;
  onEditSuccess: () => void;
};
export const EditReportingManagerDialog = ({
  onClose,
  open,
  employeeId,
  companyId,
  onEditSuccess,
}: EditReportingManagerDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: reportingManagerDetails, isFetching } =
    useGetEmployeeOrganizationSectionDetail({
      employeeId,
      section: "reporting_manager",
    });

  const { operationType, menuItems } = useTabOptions({
    effectFrom: !!reportingManagerDetails?.effective_from,
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
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: ReportingManagerFormFieldValues = merge(
          error["reporting_manager"]
        );

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
    if (reportingManagerDetails) {
      const reportingManagerFormFieldValues: ReportingManagerFormProps["defaultValues"] =
        {
          id: reportingManagerDetails.id,
          effective_from: reportingManagerDetails.effective_from,
          remark: reportingManagerDetails.remark,
          joining_date: reportingManagerDetails.joining_date,
          operationType,
        };

      return reportingManagerFormFieldValues;
    }
  }, [reportingManagerDetails]);

  const onEditReportingManager = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditOrganizationDetailPayload = {
        reporting_manager: {
          id: formValues.id,
          remark: formValues.remark,
          effective_from:
            formValues.effective_from &&
            DateTime.fromISO(formValues.effective_from).toFormat(
              dateFormats.dateWithISO8601
            ),
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
      title="Edit Reporting Manager"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditReportingManager}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs tabs={menuItems} value={operationType} loading={isFetching} />

      <ReportingManagerForm
        ref={formRef}
        operationType={operationType}
        loading={isFetching}
        defaultValues={defaultValues}
        companyId={companyId}
      />
    </Dialog>
  );
};
