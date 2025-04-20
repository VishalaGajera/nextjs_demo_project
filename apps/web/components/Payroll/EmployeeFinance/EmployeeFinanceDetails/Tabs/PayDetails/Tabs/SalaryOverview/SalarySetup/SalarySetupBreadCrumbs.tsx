import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";
import { PAY_DETAILS, SALARY_OVERVIEW } from "../../../../constants";

type SalarySetupBreadCrumbsProps = Readonly<{
  employeeId: string;
}>;

export const SalarySetupBreadCrumbs = ({
  employeeId,
}: SalarySetupBreadCrumbsProps) => {
  const router = useRouter();

  return (
    <Breadcrumbs
      items={[
        {
          icon: <SvgsHome />,
          onClick: () => router.push("/"),
        },
        {
          text: "Payroll",
        },
        {
          text: "Employee Finance",
          onClick: () => router.push("/payroll/employee-finance"),
        },
        {
          text: "Employee Finance Details",
          onClick: () =>
            router.push(
              `/payroll/employee-finance/${employeeId}?tab=${PAY_DETAILS}&detail=${SALARY_OVERVIEW}`
            ),
        },
        {
          text: "Salary Setup",
        },
      ]}
    />
  );
};
