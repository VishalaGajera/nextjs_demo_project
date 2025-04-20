import { useRouter } from "next/navigation";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export type UseTabOptionsArgs = {
  holidayGroupId: string;
  holidayYears: { year: string }[];
};

export const useTabOptions = ({
  holidayGroupId,
  holidayYears,
}: UseTabOptionsArgs) => {
  const router = useRouter();

  const tabOptions = holidayYears || [];

  const menuItems: TabsItems[] =
    tabOptions?.map((item) => ({
      value: item.year,
      title: item.year,
      onClick: () =>
        router.push(
          `/employee-management/holiday?tab=${holidayGroupId}&year=${item.year}`
        ),
    })) || [];

  return { menuItems };
};
