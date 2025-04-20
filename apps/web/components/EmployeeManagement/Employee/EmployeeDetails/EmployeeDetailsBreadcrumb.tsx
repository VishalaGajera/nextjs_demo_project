import { Breadcrumbs, SvgsHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";
import type { ButtonViewTypeKeys } from "../../../../app/employee-management/employee/hooks/useGetButtonOptions";

type EmployeeDetailsBreadcrumbArgs = {
  view: ButtonViewTypeKeys;
};

export const EmployeeDetailsBreadcrumb = ({
  view,
}: EmployeeDetailsBreadcrumbArgs) => {
  const router = useRouter();

  return (
    <Breadcrumbs
      items={[
        {
          icon: <SvgsHome />,
          onClick: () => router.push("/"),
        },
        {
          text: "Employee Management",
        },
        {
          text: "Employee",
          onClick: () =>
            router.push(`/employee-management/employee?view=${view}`),
        },
        {
          text: "Employee Details",
        },
      ]}
    />
  );
};
