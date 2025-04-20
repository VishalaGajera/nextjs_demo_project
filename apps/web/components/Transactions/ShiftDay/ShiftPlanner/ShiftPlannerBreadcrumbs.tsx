import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const ShiftPlannerBreadcrumbs = () => {
  const router = useRouter();

  return (
    <Breadcrumbs
      items={[
        {
          icon: <SvgsHome />,
          onClick: () => router.push("/"),
        },
        {
          text: "Transactions",
        },
        {
          text: "Shift & Day",
        },
        {
          text: "Shift Planner",
        },
      ]}
    />
  );
};
