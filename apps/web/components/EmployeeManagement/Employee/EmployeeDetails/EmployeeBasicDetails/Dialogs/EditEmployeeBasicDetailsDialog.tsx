import { Button, dateFormats, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { isFunction } from "lodash";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { employeeOrganizationDetails } from "../../../../../../queryKeysFactories/employeeOrganizationDetails";
import { employeePostDetails } from "../../../../../../queryKeysFactories/employeePostDetails";
import { employeeSchemaDetails } from "../../../../../../queryKeysFactories/employeeSchemaDetails";
import { dateDaysDifference } from "../../../../../../utils/date";
import { onError } from "../../../../../../utils/errors";
import { EditAction } from "../../../../../common/EditAction";
import {
  ORGANIZATION_DETAILS,
  POST_DETAILS,
  SCHEMA_DETAILS,
} from "../../Tabs/EmployeeWorkPost/Tabs/hooks/constant";
import type {
  EmployeeBasicDetailsFormFieldValues,
  FormRef,
} from "../EmployeeBasicDetailsForm";
import { EmployeeBasicDetailsForm } from "../EmployeeBasicDetailsForm";
import { useGetEmployeeBasicDetails } from "../hooks/useGetEmployeeBasicDetails";
import { useEditEmployeeBasicDetails } from "./hooks/useEditEmployeeBasicDetails";

type EditEmployeeBasicDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
};

export const EditEmployeeBasicDetailsDialog = ({
  employeeId,
  open,
  onClose,
  onEditSuccess,
}: EditEmployeeBasicDetailsDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const queryClient = useQueryClient();

  const searchParams = useSearchParams();

  const tab = searchParams.get("subtab");

  const {
    data: employeeBasicDetailsData,
    isPending: isPendingEmployeeBasicDetailsData,
  } = useGetEmployeeBasicDetails({
    employeeId,
  });

  const { mutate, isPending } = useEditEmployeeBasicDetails({
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();

        if (isFunction(onEditSuccess)) {
          onEditSuccess();
        }

        if (tab === ORGANIZATION_DETAILS) {
          queryClient.invalidateQueries({
            queryKey: employeeOrganizationDetails.get(employeeId),
          });
        } else if (tab === POST_DETAILS) {
          queryClient.invalidateQueries({
            queryKey: employeePostDetails.get(employeeId),
          });
        } else if (tab === SCHEMA_DETAILS) {
          queryClient.invalidateQueries({
            queryKey: employeeSchemaDetails.get(employeeId),
          });
        }

        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditEmployeeBasicDetails = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (employeeBasicDetailsData) {
      const employeeBasicDetailsFormFieldValues: EmployeeBasicDetailsFormFieldValues =
        {
          avatar: employeeBasicDetailsData.avatar,
          punch_code: employeeBasicDetailsData.punch_code,
          title:
            employeeBasicDetailsData.title as EmployeeBasicDetailsFormFieldValues["title"],
          first_name: employeeBasicDetailsData.first_name,
          middle_name: employeeBasicDetailsData.middle_name,
          last_name: employeeBasicDetailsData.last_name,
          nick_name: employeeBasicDetailsData.nick_name,
          date_of_birth: DateTime.fromISO(
            employeeBasicDetailsData.date_of_birth
          ).toFormat(dateFormats.dateWithISO8601),
          probation_period:
            employeeBasicDetailsData.joining_date &&
            employeeBasicDetailsData.confirmation_date
              ? dateDaysDifference(
                  employeeBasicDetailsData.joining_date,
                  employeeBasicDetailsData.confirmation_date
                )
              : null,
          gender: employeeBasicDetailsData.gender,
          joining_date: DateTime.fromISO(
            employeeBasicDetailsData.joining_date
          ).toFormat(dateFormats.dateWithISO8601),
          on_book_joining_date: employeeBasicDetailsData.on_book_joining_date
            ? DateTime.fromISO(
                employeeBasicDetailsData.on_book_joining_date
              ).toFormat(dateFormats.dateWithISO8601)
            : null,
          confirmation_date: employeeBasicDetailsData.confirmation_date
            ? DateTime.fromISO(
                employeeBasicDetailsData.confirmation_date
              ).toFormat(dateFormats.dateWithISO8601)
            : null,
          email: employeeBasicDetailsData.email,
          mobile_no: employeeBasicDetailsData.mobile_no,
          alternate_mobile_no: employeeBasicDetailsData.alternate_mobile_no,
          designation_id: employeeBasicDetailsData.designation_id,
        };

      return employeeBasicDetailsFormFieldValues;
    }
  }, [employeeBasicDetailsData]);

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Employee Basic Details"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditEmployeeBasicDetails}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <EmployeeBasicDetailsForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingEmployeeBasicDetailsData}
      />
    </Dialog>
  );
};
