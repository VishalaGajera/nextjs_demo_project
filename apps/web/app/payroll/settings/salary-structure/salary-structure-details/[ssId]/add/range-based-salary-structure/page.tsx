"use client";

import { Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { AddRangeBasedSalaryStructure } from "../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/RangeBasedSalaryStructure/Add/AddRangeBasedSalaryStructure";
import { TypeBasedSalaryStructureBreadCrumbs } from "../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/TypeBasedSalaryStructureBreadCrumbs";

type PageProps = {
  params: {
    ssId: string;
  };
};

export default function Page({ params }: Readonly<PageProps>) {
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  return (
    <Stack gap="10px">
      <TypeBasedSalaryStructureBreadCrumbs
        ssId={params.ssId}
        pageType={tab ? "Edit" : "Add"}
        pageTitle="Range Based"
      />

      <AddRangeBasedSalaryStructure ssId={params.ssId} />
    </Stack>
  );
}
