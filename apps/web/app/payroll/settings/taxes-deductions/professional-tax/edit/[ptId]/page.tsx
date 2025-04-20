"use client";

import { Button, Card, toasts } from "@codezee/sixtify-brahma";
import { Stack, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { ProfessionalTaxBreadCrumbs } from "../../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/AddProfessionalTax/ProfessionalTaxBreadCrumbs";
import { EditAction } from "../../../../../../../components/common/EditAction";
import {
  type FormRef,
  ProfessionalTaxForms,
  type TaxConfigType,
} from "../../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/AddProfessionalTax/ProfessionalTaxForms";
import { formatePayLoad } from "../../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/AddProfessionalTax/utils/ptGrouphelper";
import { useEditProfessionalTax } from "../../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/EditProfessionalTax/Hooks/useEditProfessioanlTax";
import { useGetProfessionalTaxWithId } from "../../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/EditProfessionalTax/Hooks/useGetProfessionalTaxWithId";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { useDisabledButtonsCache } from "../../../../../../context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";

export type PageProps = Readonly<{
  params: {
    ptId: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { ptId } = params;

  const { data, isLoading } = useGetProfessionalTaxWithId({
    ptId,
  });

  const { mutate, isPending } = useEditProfessionalTax({
    ptId,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/payroll/settings/taxes-deductions?tab=pt-group");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const handleEdit = () => {
    formRef.current?.submitForm((payloadData) => {
      mutate(payloadData);
    });
  };

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const formatedDefaultValues: TaxConfigType | undefined = useMemo(() => {
    const formatedPayload = formatePayLoad(data);

    return formatedPayload;
  }, [data]);

  return (
    <Stack gap="10px">
      <ProfessionalTaxBreadCrumbs type="Edit" />

      <Stack
        sx={{
          padding: "20px",
          minHeight: "calc(95vh - 140px)",
          background: iron[600],
          border: `1px solid ${butterflyBlue[300]}`,
          borderRadius: "6px",
          gap: "10px",
        }}
      >
        <ProfessionalTaxForms
          defaultValues={formatedDefaultValues}
          actionType="update"
          loading={isLoading}
          ref={formRef}
        />

        <Card>
          <Stack direction="row" gap="5px" justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() =>
                router.push("/payroll/settings/taxes-deductions?tab=pt-group")
              }
            >
              Cancel
            </Button>

            <EditAction
              loading={isPending}
              disabled={isDisabled()}
              onClick={handleEdit}
            />
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
