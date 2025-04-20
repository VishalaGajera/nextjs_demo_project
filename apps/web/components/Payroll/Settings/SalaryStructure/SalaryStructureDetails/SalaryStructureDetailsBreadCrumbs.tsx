import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const SalaryStructureDetailsBreadCrumbs = () => {
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
          text: "Settings",
        },
        {
          text: "Salary Structure",
          onClick: () => router.push("/payroll/settings/salary-structure"),
        },
        {
          text: "Salary Structure Details",
        },
      ]}
    />
  );
};
