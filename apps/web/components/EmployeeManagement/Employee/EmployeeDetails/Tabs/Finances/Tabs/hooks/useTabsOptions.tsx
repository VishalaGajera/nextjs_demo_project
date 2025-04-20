import { useRouter } from "next/navigation";
import type { ButtonViewTypeKeys } from "../../../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";
import {
  BANK_STATUTORY,
  PAY_DETAILS,
  SALARY_OVERVIEW,
} from "../../../../../../../Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/constants";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  [BANK_STATUTORY]: "Bank & Statutory",
  [PAY_DETAILS]: "Pay Details",
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
      value: BANK_STATUTORY,
      title: "Bank & Statutory",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=finances&subtab=${BANK_STATUTORY}&view=${view}`
        ),
    },
    {
      value: PAY_DETAILS,
      title: "Pay Details",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=finances&subtab=${PAY_DETAILS}&detail=${SALARY_OVERVIEW}&view=${view}`
        ),
    },
  ];

  return { menuItems };
};
