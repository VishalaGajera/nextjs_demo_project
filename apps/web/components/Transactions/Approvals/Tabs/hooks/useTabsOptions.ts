import { useRouter } from "next/navigation";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  overtime: "Overtime",
  leave: "Leave",
};

export type OptionKey = keyof typeof categories;

export const useTabOptions = () => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: "overtime",
      title: categories.overtime,
      onClick: () => router.push("/transactions/approvals?tab=overtime"),
    },
    {
      value: "leave",
      title: categories.leave,
      onClick: () => router.push("/transactions/approvals?tab=leave"),
    },
  ];

  return { menuItems };
};
