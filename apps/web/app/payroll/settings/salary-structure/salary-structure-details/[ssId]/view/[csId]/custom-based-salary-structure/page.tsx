"use client";

import { Stack } from "@mui/material";
import { useGetSalaryStructureById } from "../../../../../../../../../components/Payroll/Settings/SalaryStructure/EditSalaryStructure/Dialogs/Hooks/useGetSalaryStructureById";
import { DefaultCustomBasedSalaryStructure } from "../../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/CustomBasedSalaryStructure/DefaultStructure/DefaultCustomBasedSalaryStructure";
import { ViewCustomBasedSalaryStructure } from "../../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/CustomBasedSalaryStructure/View/ViewCustomBasedSalaryStructure";
import { TypeBasedSalaryStructureBreadCrumbs } from "../../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/TypeBasedSalaryStructureBreadCrumbs";

type PageProps = {
  params: {
    ssId: string;
    csId: string;
  };
};

const Page = ({ params }: PageProps) => {
  const { csId, ssId } = params;

  const { data } = useGetSalaryStructureById({ ssId });

  const defaultSalaryStructureName = data?.salary_structure_name === "Default";

  return (
    <Stack gap="10px">
      <TypeBasedSalaryStructureBreadCrumbs
        ssId={ssId}
        pageType="View"
        pageTitle="Custom Based"
      />

      {defaultSalaryStructureName ? (
        <DefaultCustomBasedSalaryStructure
          pageType="view"
          ssId={ssId}
          csId={csId}
        />
      ) : (
        <ViewCustomBasedSalaryStructure ssId={ssId} csId={csId} />
      )}
    </Stack>
  );
};

export default Page;
