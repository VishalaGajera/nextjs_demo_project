import { useRouter } from "next/navigation";
import type { ButtonViewTypeKeys } from "../../../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  document: "Document",
  "salary-slip": "Salary Slip",
  letters: "Letters",
  "policies-forms": "Policies & Forms",
};

export type OptionKey = keyof typeof categories;

export type UseTabOptionsArgs = Readonly<{
  employeeId: string;
  view: ButtonViewTypeKeys;
}>;

export const useTabOptions = ({ employeeId, view }: UseTabOptionsArgs) => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: "document",
      title: "Document",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=employee-documents&subtab=document&view=${view}`
        ),
    },
    {
      value: "salary-slip",
      title: "Salary Slip",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=employee-documents&subtab=salary-slip&view=${view}`
        ),
    },
    {
      value: "letters",
      title: "Letters",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=employee-documents&subtab=letters&view=${view}`
        ),
    },
    {
      value: "policies-forms",
      title: "Policies & Forms",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=employee-documents&subtab=policies-forms&view=${view}`
        ),
    },
  ];

  return { menuItems };
};
