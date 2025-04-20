import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const EmployeeFInanceDetailsBreadCrumbs = () => {
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
        },
      ]}
    />
  );
};
