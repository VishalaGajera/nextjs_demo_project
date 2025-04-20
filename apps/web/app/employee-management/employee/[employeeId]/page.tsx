"use client";

import { Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { EditEmployee } from "../../../../components/EmployeeManagement/Employee/EditEmployee/EditEmployee";
import { EmployeeBasicDetails } from "../../../../components/EmployeeManagement/Employee/EmployeeDetails/EmployeeBasicDetails/EmployeeBasicDetails";
import { EmployeeDetailsBreadcrumb } from "../../../../components/EmployeeManagement/Employee/EmployeeDetails/EmployeeDetailsBreadcrumb";
import { Tabs } from "../../../../components/EmployeeManagement/Employee/EmployeeDetails/Tabs/Tabs";
import { DIRECTORY, EDIT_EMPLOYEE, LIST } from "../hooks/constant";

export type PageProps = Readonly<{
  params: {
    employeeId: string;
    page?: string;
  };
}>;

export default function Page({ params }: PageProps) {
  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const view = searchParams.get("view") === DIRECTORY ? DIRECTORY : LIST;

  const { employeeId } = params;

  if (page === EDIT_EMPLOYEE) {
    return <EditEmployee employeeId={employeeId} />;
  }

  return (
    <Stack gap="20px">
      <EmployeeDetailsBreadcrumb view={view} />
      <EmployeeBasicDetails employeeId={employeeId} />
      <Tabs employeeId={employeeId} view={view} />
    </Stack>
  );
}
