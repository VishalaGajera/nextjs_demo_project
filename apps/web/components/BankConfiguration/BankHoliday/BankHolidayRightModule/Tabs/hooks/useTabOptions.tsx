import { useRouter } from "next/navigation";
import type { TabsItems } from "../../../../../EmployeeManagement/Holiday/HolidayRightModule/HolidayGroupList/Tabs/hooks/useTabOptions";

export type UseTabOptionsArgs = {
  companyId: string;
  bankHolidayYears: { year: string }[];
};

export const useTabOptions = ({
  companyId,
  bankHolidayYears,
}: UseTabOptionsArgs) => {
  const router = useRouter();

  const tabOptions = bankHolidayYears || [];

  const menuItems: TabsItems[] =
    tabOptions?.map((item) => ({
      value: item.year,
      title: item.year,
      onClick: () =>
        router.push(
          `/bank-configurations/bank-holiday?tab=${companyId}&year=${item.year}`
        ),
    })) || [];

  return { menuItems };
};
