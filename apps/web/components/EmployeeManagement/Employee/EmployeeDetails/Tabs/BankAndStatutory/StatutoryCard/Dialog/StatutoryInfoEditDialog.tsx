import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { statutoryKeys } from "../../../../../../../../queryKeysFactories/statutory";
import { onError } from "../../../../../../../../utils/errors";
import { filterChangedFormFields } from "../../../../../../../../utils/helper";
import { EditAction } from "../../../../../../../common/EditAction";
import type { StatutoryFormFieldValues } from "../../../../../AddEmployee/EmployeeForm/StatutoryInfoForm";
import {
  StatutoryInfoForm,
  StatutoryInfoFormSchema,
} from "../../../../../AddEmployee/EmployeeForm/StatutoryInfoForm";
import { useEditStatutoryInfo } from "./hooks/useEditStatutoryInfo";
import { useGetStatutoryInfo } from "./hooks/useGetStatutoryInfo";

type BankInfoEditDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};
export const StatutoryInfoEditDialog = ({
  onClose,
  open,
  employeeId,
}: BankInfoEditDialogProps) => {
  const { data: StatutoryInformation, isFetching: loading } =
    useGetStatutoryInfo({
      employeeId,
    });

  const defaultValues = useMemo(() => {
    if (StatutoryInformation) {
      const statutoryFormFieldValues: StatutoryFormFieldValues = {
        pf_applicable: StatutoryInformation.pf_applicable,
        epf_group_id: StatutoryInformation.epf_group_id,
        pt_applicable: StatutoryInformation.pt_applicable,
        pf_account_no: StatutoryInformation.pf_account_no,
        pf_joining_date: StatutoryInformation.pf_joining_date,
        uan_no: StatutoryInformation.uan_no,
        esic_applicable: StatutoryInformation.esic_applicable,
        esic_group_id: StatutoryInformation.esic_group_id,
        esic_no: StatutoryInformation.esic_no,
        esic_joining_date: StatutoryInformation.esic_joining_date,
        lwf_applicable: StatutoryInformation.lwf_applicable,
        tds_applicable: StatutoryInformation.tds_applicable,
        tax_regime_id: StatutoryInformation.tax_regime_id,
      };

      return statutoryFormFieldValues;
    }
  }, [StatutoryInformation]);

  const queryClient = useQueryClient();

  const methods = useForm({
    values: defaultValues,
    resolver: zodResolver(StatutoryInfoFormSchema),
    mode: "all",
  });

  const {
    handleSubmit,
    setError,
    formState: { dirtyFields },
  } = methods;

  const { mutate, isPending } = useEditStatutoryInfo({
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();
        queryClient.invalidateQueries({
          queryKey: statutoryKeys.get(employeeId),
        });
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, setError),
    },
  });

  const editStatutoryInfo = () => {
    handleSubmit((formValues) => {
      const filterFormValues = filterChangedFormFields(formValues, dirtyFields);

      mutate(filterFormValues);
    })();
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Statutory Details"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction onClick={editStatutoryInfo} loading={isPending} />
        </Stack>
      }
    >
      <FormProvider {...methods}>
        <StatutoryInfoForm loading={loading} />
      </FormProvider>
    </Dialog>
  );
};
