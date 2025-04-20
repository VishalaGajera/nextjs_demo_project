import { useRouter, useSearchParams } from "next/navigation";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  day: "Day",
  hours: "Hours",
};

export type OptionKey = keyof typeof categories;

export type UseTabOptionsArgs = {
  employeeId: string;
};

export const useTabOptions = ({ employeeId }: UseTabOptionsArgs) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const view = searchParams.get("view");

  const employeeAttendanceTab = searchParams.get("tab");

  const dayPath = employeeAttendanceTab
    ? `/employee-management/employee/${employeeId}?tab=attendance&type=day&view=${view}`
    : `/transactions/attendance/attendance-overview/attendance-details/employee/${employeeId}?type=day&view=${view}`;

  const hoursPath = employeeAttendanceTab
    ? `/employee-management/employee/${employeeId}?tab=attendance&type=hours&view=${view}`
    : `/transactions/attendance/attendance-overview/attendance-details/employee/${employeeId}?type=hours&view=${view}`;

  const menuItems: TabsItems[] = [
    {
      value: "day",
      title: "Day",
      onClick: () => router.push(dayPath),
    },
    {
      value: "hours",
      title: "Hours",
      onClick: () => router.push(hoursPath),
    },
  ];

  return { menuItems };
};
