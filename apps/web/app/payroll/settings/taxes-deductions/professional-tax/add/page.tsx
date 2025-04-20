"use client";

import { Button, Card, toasts } from "@codezee/sixtify-brahma";
import { Stack, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useAddProfessionalTax } from "../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/AddProfessionalTax/Hooks/useAddProfessionalTax";
import { ProfessionalTaxBreadCrumbs } from "../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/AddProfessionalTax/ProfessionalTaxBreadCrumbs";
import {
  type FormRef,
  ProfessionalTaxForms,
} from "../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/AddProfessionalTax/ProfessionalTaxForms";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { useDisabledButtonsCache } from "../../../../../context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";

export default function Page() {
  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { mutate, isPending } = useAddProfessionalTax({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/payroll/settings/taxes-deductions?tab=pt-group");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const handleSubmit = () => {
    formRef.current?.submitForm((payloadData) => {
      mutate(payloadData);
    });
  };

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  return (
    <Stack gap="10px">
      <ProfessionalTaxBreadCrumbs type="Add" />

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
        <ProfessionalTaxForms ref={formRef} actionType="add" />

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

            <Button
              loading={isPending}
              disabled={isDisabled()}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
