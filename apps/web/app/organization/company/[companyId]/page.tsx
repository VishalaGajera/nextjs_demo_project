"use client";

import { Stack } from "@mui/material";
import { CompanyBasicDetails } from "../../../../components/organization/company/CompanyDetails/CompanyBasicDetails/CompanyBasicDetails";
import { CompanyDetailsBreadcrumb } from "../../../../components/organization/company/CompanyDetails/CompanyDetailsBreadcrumb";
import { Tabs } from "../../../../components/organization/company/CompanyDetails/Tabs/Tabs";

export type PageProps = Readonly<{
  params: {
    companyId: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const { companyId } = params;

  return (
    <Stack gap="20px">
      <CompanyDetailsBreadcrumb />
      <CompanyBasicDetails companyId={companyId} />
      <Tabs companyId={companyId} />
    </Stack>
  );
}
