import { useParams, useRouter } from "next/navigation";

export type TabsItems = {
  value: string;
  title: string;
  onClick: () => void;
};

export const categories = {
  monthly: "Monthly",
  annually: "Annually",
  daily: "Daily",
  hourly: "Hourly",
};

export type OptionKey = keyof typeof categories;

export const useTabOptionsConverter = ({
  options,
}: {
  options: OptionKey[];
}) => {
  const router = useRouter();

  const params = useParams();

  const { ssId } = params;

  const menuItems = options.map((option) => {
    return {
      value: option,
      title: categories[option],
      onClick: () =>
        router.push(
          `/payroll/settings/salary-structure/salary-structure-details/${ssId}?interval=${option}`
        ),
    };
  });

  return { menuItems };
};
