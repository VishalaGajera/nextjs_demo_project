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
  EditLoanPolicyForm,
  type EditLoanPolicyFormFieldValues,
  type EditLoanPolicyFormProps,
  type FormRef,
} from "./EditLoanPolicyForm";

type EditLoanPolicyDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const EditLoanPolicyDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditLoanPolicyDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: loanPolicyDetails, isFetching: isPendingloanPolicyDetails } =
    useGetSectionSchemaDetail({
      employeeId,
      section: "loan_policy",
    });

  const { operationType, menuItems } = useTabOptions({
    effectFrom: !!loanPolicyDetails?.effective_from,
  });

  const { mutate, isPending } = useEditSchemaDetails({
    employeeId,
    section: "loan_policy",
    operationType,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (res) => {
        const { error, message } = res.response.data;

        const formattedError: EditLoanPolicyFormFieldValues = merge(error);

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
    if (loanPolicyDetails) {
      const isLoanPolicyId = loanPolicyDetails.id ? false : true;

      const loanPolicyFormFieldValues: EditLoanPolicyFormProps["defaultValues"] =
        {
          id: loanPolicyDetails.id,
          effective_from: loanPolicyDetails.effective_from,
          effective_to: loanPolicyDetails.effective_to,
          has_no_end_date: loanPolicyDetails.has_no_end_date,
          unassigned_rule: !loanPolicyDetails.effective_from
            ? false
            : isLoanPolicyId,
          remark: loanPolicyDetails.remark,
          joining_date: loanPolicyDetails.joining_date,
          operationType,
        };

      return loanPolicyFormFieldValues;
    }
  }, [loanPolicyDetails]);

  const onEditLoanPolicy = () => {
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
      title="Update Loan Policy Detail"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditLoanPolicy}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingloanPolicyDetails}
      />

      <EditLoanPolicyForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingloanPolicyDetails}
        companyId={companyId}
      />
    </Dialog>
  );
};
