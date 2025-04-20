import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const AddOvertimeRulesBreadcrumbs = () => {
  const router = useRouter();

  return (
    <Breadcrumbs
      items={[
        {
          icon: <SvgsHome />,
          onClick: () => router.push("/"),
        },
        {
          text: "Policy Configuration",
        },
        {
          text: "Overtime",
        },
        {
          text: "Overtime Rules",
          onClick: () =>
            router.push("/policy-configuration/overtime/overtime-rules"),
        },
        {
          text: "Add Overtime Rules",
        },
      ]}
    />
  );
};
