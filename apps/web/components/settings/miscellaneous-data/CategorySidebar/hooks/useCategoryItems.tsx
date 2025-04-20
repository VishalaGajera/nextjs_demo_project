import { useRouter } from "next/navigation";

export const categories = {
  industry: "Industry",
  department: "Department",
  "sub-department": "Sub Department",
  designation: "Designation",
  bank: "Bank",
  "work-type": "Work Type",
  "skill-type": "Skill Type",
  grade: "Grade",
  "sub-caste": "Sub Caste",
  holiday: "Holiday",
  "loan-category": "Loan Category",
};

export type Categories = typeof categories;

export type CategoryKeys = keyof typeof categories;

export type CategoryItem = {
  key: CategoryKeys;
  title: string;
  onClick: () => void;
};

export const useCategoryItems = () => {
  const router = useRouter();

  const categoryItems: CategoryItem[] = [
    {
      key: "industry",
      title: "Industry",
      onClick: () => router.push("/settings/miscellaneous-data?tab=industry"),
    },
    {
      key: "department",
      title: "Department",
      onClick: () => router.push("/settings/miscellaneous-data?tab=department"),
    },
    {
      key: "sub-department",
      title: "Sub Department",
      onClick: () =>
        router.push("/settings/miscellaneous-data?tab=sub-department"),
    },
    {
      key: "designation",
      title: "Designation",
      onClick: () =>
        router.push("/settings/miscellaneous-data?tab=designation"),
    },
    {
      key: "bank",
      title: "Bank",
      onClick: () => router.push("/settings/miscellaneous-data?tab=bank"),
    },
    {
      key: "work-type",
      title: "Work Type",
      onClick: () => router.push("/settings/miscellaneous-data?tab=work-type"),
    },
    {
      key: "skill-type",
      title: "Skill Type",
      onClick: () => router.push("/settings/miscellaneous-data?tab=skill-type"),
    },
    {
      key: "grade",
      title: "Grade",
      onClick: () => router.push("/settings/miscellaneous-data?tab=grade"),
    },
    {
      key: "sub-caste",
      title: "Sub Caste",
      onClick: () => router.push("/settings/miscellaneous-data?tab=sub-caste"),
    },
    {
      key: "holiday",
      title: "Holiday",
      onClick: () => router.push("/settings/miscellaneous-data?tab=holiday"),
    },
    {
      key: "loan-category",
      title: "Loan Category",
      onClick: () =>
        router.push("/settings/miscellaneous-data?tab=loan-category"),
    },
  ];

  return { categoryItems };
};
