"use client";

import { Stack } from "@mui/material";
import { AddCustomBasedSalaryStructure } from "../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/CustomBasedSalaryStructure/Add/AddCustomBasedSalaryStructure";
import { TypeBasedSalaryStructureBreadCrumbs } from "../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/TypeBasedSalaryStructureBreadCrumbs";

type PageProps = {
  params: {
    ssId: string;
  };
};

export default function Page({ params }: Readonly<PageProps>) {
  return (
    <Stack gap="10px">
      <TypeBasedSalaryStructureBreadCrumbs
        ssId={params.ssId}
        pageType="Add"
        pageTitle="Custom Based"
      />

      <AddCustomBasedSalaryStructure ssId={params.ssId} />
    </Stack>
  );
}
