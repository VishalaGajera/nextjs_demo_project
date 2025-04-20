import { useRouter } from "next/navigation";
import type { ButtonViewTypeKeys } from "../../../../../../app/employee-management/employee/hooks/useGetButtonOptions";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  "employee-profile": "Employee Profile",
  "family-details": "Family Details",
  "past-work-employment": "Past work Employment",
  "insurance-details": "Insurance Details",
  "org-post-policy": "Work & Post Type",
  attendance: "Attendance",
  leave: "Leave",
  finances: "Finances",
  "employee-documents": "Employee Documents",
};

export type OptionKey = keyof typeof categories;

export type UseTabOptionsArgs = {
  employeeId: string;
  view: ButtonViewTypeKeys;
};

export const useTabOptions = ({ employeeId, view }: UseTabOptionsArgs) => {
  const router = useRouter();

  const menuItems: TabsItems[] = [
    {
      value: "employee-profile",
      title: "Employee Profile",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=employee-profile&view=${view}`
        ),
    },
    {
      value: "family-details",
      title: "Family Details",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=family-details&view=${view}`
        ),
    },
    {
      value: "past-work-employment",
      title: "Past work Employment",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=past-work-employment&view=${view}`
        ),
    },
    {
      value: "insurance-details",
      title: "Insurance Details",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=insurance-details&view=${view}`
        ),
    },
    {
      value: "org-post-policy",
      title: "Org, Post & Policy",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=org-post-policy&subtab=organization-details&view=${view}`
        ),
    },
    {
      value: "attendance",
      title: "Attendance",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=attendance&type=day&view=list_view`
        ),
    },
    {
      value: "leave",
      title: "Leave",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=leave&view=${view}`
        ),
    },
    {
      value: "finances",
      title: "Finances",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=finances&subtab=bank-statutory&view=${view}`
        ),
    },
    {
      value: "employee-documents",
      title: "Employee Documents",
      onClick: () =>
        router.push(
          `/employee-management/employee/${employeeId}?tab=employee-documents&subtab=document&view=${view}`
        ),
    },
  ];

  return { menuItems };
};
