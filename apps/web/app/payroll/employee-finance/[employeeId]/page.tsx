"use client";

import { EmployeeFinanceDetails } from "../../../../components/Payroll/EmployeeFinance/EmployeeFinanceDetails/EmployeeFinanceDetails";

export type PageProps = {
  params: { employeeId: string };
};

const Page = ({ params }: PageProps) => {
  return <EmployeeFinanceDetails employeeId={params.employeeId} />;
};

export default Page;
