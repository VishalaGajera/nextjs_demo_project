import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty, omit } from "lodash";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceCallback } from "usehooks-ts";
import { useApplicationContext } from "../../../../app/context/ApplicationContext";
import { employeeKeys } from "../../../../queryKeysFactories/employee";
import { onError } from "../../../../utils/errors";
import { useEditEmployeeDraft } from "../EditEmployee/hooks/useEditEmployeeDraft";
import { formDefaultValues } from "./EmployeeForm";
import { useAddEmployeeDraft } from "./hooks/useAddEmployeeDraft";
import {
  marshalDocumentPayload,
  marshalEmployeePayload,
} from "./MarshalEmployeeData";

type AddDraftEmployeeDialogArgs = Readonly<{
  open: boolean;
  onSuccess: () => void;
  onDialogClose: () => void;
}>;

export default function AddDraftEmployeeDialog({
  open,
  onSuccess,
  onDialogClose,
}: AddDraftEmployeeDialogArgs) {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const params = useParams();

  const employeeId = params.employeeId as string;

  const {
    employeeFormValues,
    documentFormValues,
    setIsOpenAddEditEmployeePage,
    setEmployeeFormValues,
    setDocumentFormValues,
  } = useApplicationContext();

  const onSuccessApi = (message: string) => {
    if (!isEmpty(documentFormValues)) {
      setDocumentFormValues([]);
    }

    onDialogClose();

    setEmployeeFormValues(formDefaultValues);

    setIsOpenAddEditEmployeePage(false);

    toasts.success({ title: message });

    if (!employeeId) {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.searchMetaData(),
      });
    }

    onSuccess();
  };

  const { mutate, isPending } = useAddEmployeeDraft({
    options: {
      onSuccess: (data) => onSuccessApi(data.message),
      onError: (error) => onError(error),
    },
  });

  const { mutate: editEmployeeMutate, isPending: editEmployeePending } =
    useEditEmployeeDraft({
      employeeId,
      options: {
        onSuccess: (data) => onSuccessApi(data.message),
        onError: (error) => onError(error),
      },
    });

  const onSubmit = () => {
    if (!isEmpty(employeeFormValues)) {
      if (!employeeFormValues.first_name && !employeeFormValues.last_name) {
        toasts.error({
          title: t("employee.first_name_last_name.required"),
        });

        return;
      }

      if (!employeeFormValues.first_name) {
        toasts.error({
          title: t("employee.first_name.required"),
        });

        return;
      }

      if (!employeeFormValues.last_name) {
        toasts.error({
          title: t("employee.last_name.required"),
        });

        return;
      }

      const documentPayload =
        (employeeFormValues.document_details &&
          !isEmpty(employeeFormValues.document_details) &&
          marshalDocumentPayload(employeeFormValues.document_details)) ||
        [];

      const payload = marshalEmployeePayload(
        employeeFormValues,
        documentPayload
      );

      const draftPayload = {
        basic_details: omit(payload.basic_details, ["alternate_mobile_no"]),
        work_details: payload.work_details,
        document_details: payload.document_details,
      };

      if (employeeId) {
        editEmployeeMutate(draftPayload);
      } else {
        mutate(draftPayload);
      }
    }
  };

  const handleBackButton = useDebounceCallback(() => {
    onDialogClose();

    window.removeEventListener("popstate", handleBackButton);
  }, 100);

  useEffect(() => {
    window.addEventListener("popstate", handleBackButton);
  }, []);

  const loading = isPending || editEmployeePending;

  const onDiscard = () => {
    onDialogClose();

    onSuccess();
  };

  return (
    <Dialog
      maxWidth="sm"
      isHideCloseIcon
      isHideDividers
      open={open}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onDialogClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>

          <Button onClick={onDiscard} variant="outlined" disabled={loading}>
            Discard
          </Button>

          <Button onClick={onSubmit} color="error" loading={loading}>
            Save Draft
          </Button>
        </Stack>
      }
    >
      <Stack gap="10px" direction="row">
        <InfoTwoToneIcon color="error" sx={{ mt: "1px" }} />

        <Typography variant="subtitle1" fontWeight={700}>
          {t("employee.dialog.save.draft")}
        </Typography>
      </Stack>
    </Dialog>
  );
}
