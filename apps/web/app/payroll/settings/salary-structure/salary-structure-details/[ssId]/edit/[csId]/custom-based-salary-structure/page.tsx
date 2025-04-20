"use client";

import { Stack } from "@mui/material";
import { useGetSalaryStructureById } from "../../../../../../../../../components/Payroll/Settings/SalaryStructure/EditSalaryStructure/Dialogs/Hooks/useGetSalaryStructureById";
import { DefaultCustomBasedSalaryStructure } from "../../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/CustomBasedSalaryStructure/DefaultStructure/DefaultCustomBasedSalaryStructure";
import { EditCustomBasedSalaryStructure } from "../../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/CustomBasedSalaryStructure/Edit/EditCustomBasedSalaryStructure";
import { TypeBasedSalaryStructureBreadCrumbs } from "../../../../../../../../../components/Payroll/Settings/SalaryStructure/SalaryStructureDetails/TypeBasedSalaryStructureBreadCrumbs";

type PageProps = {
  params: {
    ssId: string;
    csId: string;
  };
};

const Page = ({ params }: PageProps) => {
  const { data } = useGetSalaryStructureById({ ssId: params.ssId });

  const defaultSalaryStructureName = data?.salary_structure_name === "Default";

  const { csId, ssId } = params;

  return (
    <Stack gap="10px">
      <TypeBasedSalaryStructureBreadCrumbs
        ssId={ssId}
        pageType="Edit"
        pageTitle="Custom Based"
      />

      {defaultSalaryStructureName ? (
        <DefaultCustomBasedSalaryStructure
          pageType="edit"
          ssId={ssId}
          csId={csId}
        />
      ) : (
        <EditCustomBasedSalaryStructure ssId={ssId} csId={csId} />
      )}
    </Stack>
  );
};

export default Page;
