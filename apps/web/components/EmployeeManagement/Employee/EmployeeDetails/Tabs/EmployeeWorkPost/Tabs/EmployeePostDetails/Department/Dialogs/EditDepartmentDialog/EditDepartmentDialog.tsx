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
import { useTabOptions } from "../../../../EmployeeOrganizationDetails/BusinessUnit/Dialogs/EditBusinessUnitDialog/hooks/useTabOptions";
import type { EditDepartmentPayload } from "../../../hooks/useEditPostDetails";
import { useEditPostDetails } from "../../../hooks/useEditPostDetails";
import { useGetSectionPostDetail } from "../../../hooks/useGetSectionPostDetail";
import type { DepartmentFormProps, FormRef } from "./DepartmentForm";
import { DepartmentForm } from "./DepartmentForm";

type EditDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  companyId: string;
};

export const EditDepartmentDialog = ({
  employeeId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditDepartmentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { operationType, menuItems } = useTabOptions({});

  const { data: departmentDetails, isFetching: isPendingDepartmentDetail } =
    useGetSectionPostDetail({ employeeId, section: "department" });

  const { data: subDepartmentDetails } = useGetSectionPostDetail({
    employeeId,
    section: "sub_department",
  });

  const { mutate, isPending } = useEditPostDetails({
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
    if (departmentDetails && subDepartmentDetails) {
      const departmentFormFieldValues: DepartmentFormProps["defaultValues"] = {
        department: {
          id: departmentDetails.id,
          effective_from: departmentDetails.effective_from,
          remark: departmentDetails.remark,
        },
        sub_department: {
          id: subDepartmentDetails.id,
          effective_from: subDepartmentDetails.effective_from,
          remark: subDepartmentDetails.remark,
        },
        joining_date: subDepartmentDetails.joining_date,
        operationType,
      };

      return departmentFormFieldValues;
    }
  }, [departmentDetails, subDepartmentDetails]);

  const onEditDepartment = () => {
    formRef.current?.submitForm((formValues) => {
      const payload: EditDepartmentPayload = {
        department: {
          id: formValues.department?.id,
          remark: formValues.department?.remark,
          effective_from:
            formValues.department?.effective_from &&
            DateTime.fromISO(formValues.department.effective_from).toFormat(
              dateFormats.dateWithISO8601
            ),
        },
        sub_department: {
          id: formValues.sub_department?.id,
          effective_from:
            formValues.department?.effective_from &&
            DateTime.fromISO(formValues.department.effective_from).toFormat(
              dateFormats.dateWithISO8601
            ),
          remark: formValues.department?.remark,
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
      title="Edit Department"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditDepartment}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <Tabs
        tabs={menuItems}
        value={operationType}
        loading={isPendingDepartmentDetail}
      />

      <DepartmentForm
        ref={formRef}
        operationType={operationType}
        defaultValues={defaultValues}
        loading={isPendingDepartmentDetail}
        companyId={companyId}
      />
    </Dialog>
  );
};
