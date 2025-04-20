import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const SalaryStructureBreadCrumbs = () => {
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
        },
      ]}
    />
  );
};
