"use client";

import { Button, Card } from "@codezee/sixtify-brahma";
import { Box, Stack, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { ProfessionalTaxBreadCrumbs } from "../../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/AddProfessionalTax/ProfessionalTaxBreadCrumbs";
import {
  type FormRef,
  ProfessionalTaxForms,
  type TaxConfigType,
} from "../../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/AddProfessionalTax/ProfessionalTaxForms";
import { formatePayLoad } from "../../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/AddProfessionalTax/utils/ptGrouphelper";
import { useGetProfessionalTaxWithId } from "../../../../../../../components/Payroll/Settings/TaxesAndDeductions/ProfessionalTax/EditProfessionalTax/Hooks/useGetProfessionalTaxWithId";
import type { PageProps } from "../../edit/[ptId]/page";

export default function Page({ params }: PageProps) {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const { ptId } = params;

  const { data, isLoading } = useGetProfessionalTaxWithId({
    ptId,
  });

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const formatedDefaultValues: TaxConfigType | undefined = useMemo(() => {
    const formatedPayload = formatePayLoad(data);

    return formatedPayload;
  }, [data]);

  return (
    <Stack gap="10px">
      <ProfessionalTaxBreadCrumbs type="View" />

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
          actionType="view"
          loading={isLoading}
          ref={formRef}
        />

        <Card>
          <Box sx={{ display: "flex", gap: "5px", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() =>
                router.push("/payroll/settings/taxes-deductions?tab=pt-group")
              }
            >
              Cancel
            </Button>
          </Box>
        </Card>
      </Stack>
    </Stack>
  );
}
