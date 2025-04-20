import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const ProfessionalTaxBreadCrumbs = ({
  type = "Add",
}: {
  type: "Add" | "Edit" | "View";
}) => {
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
          text: "Taxes & Deductions",
        },
        {
          text: "Professional Tax",
          onClick: () => {
            router.push("/payroll/settings/taxes-deductions?tab=pt-group");
          },
        },
        {
          text: `${type} Professional Tax`,
        },
      ]}
    />
  );
};
