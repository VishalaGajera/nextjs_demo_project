import { useRouter } from "next/navigation";
import type { ButtonViewTypeKeys } from "../../../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import { ORGANIZATION_DETAILS, POST_DETAILS, SCHEMA_DETAILS } from "./constant";

export const categories = {
  [ORGANIZATION_DETAILS]: "Organization Details",
  [POST_DETAILS]: "Post Details",
  [SCHEMA_DETAILS]: "Policy Details",
};

export type OptionKey = keyof typeof categories;

export type TabsItems = {
  value: OptionKey;
  title: string;
  onClick: () => void;
};

export type UseTabOptionsArgs = Readonly<{
  employeeId: Readonly<string>;
  view: ButtonViewTypeKeys;
}>;

export const useTabOptions = ({ employeeId, view }: UseTabOptionsArgs) => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: ORGANIZATION_DETAILS,
      title: categories[ORGANIZATION_DETAILS],
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=org-post-policy&subtab=organization-details&view=${view}`
        ),
    },
    {
      value: POST_DETAILS,
      title: categories[POST_DETAILS],
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=org-post-policy&subtab=post-details&view=${view}`
        ),
    },
    {
      value: SCHEMA_DETAILS,
      title: categories[SCHEMA_DETAILS],
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=org-post-policy&subtab=policy-details&view=${view}`
        ),
    },
  ];

  return { menuItems };
};
