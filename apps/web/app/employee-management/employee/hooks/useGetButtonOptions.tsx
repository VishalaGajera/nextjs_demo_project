import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { DIRECTORY, LIST } from "./constant";

export const ButtonViewOptions = {
  [LIST]: "List",
  [DIRECTORY]: "Directory",
};

export type ButtonViewTypeKeys = keyof typeof ButtonViewOptions;

export type ButtonOptions = {
  icon: ReactNode;
  label: string;
  value: ButtonViewTypeKeys;
};

type useGetButtonOptionsArgs = {
  view: ButtonViewTypeKeys;
  isDraft: boolean;
};

export function useGetButtonOptions({
  view,
  isDraft = false,
}: useGetButtonOptionsArgs) {
  const router = useRouter();

  const buttonOptions = [
    {
      icon: <FormatListBulletedRoundedIcon />,
      label: ButtonViewOptions[LIST],
      value: LIST,
      selected: view === LIST,
      onClick: () =>
        router.push(
          `/employee-management/employee?view=${LIST}${isDraft ? "&isDraft=true" : ""}`
        ),
    },
    {
      icon: <DashboardOutlinedIcon />,
      label: ButtonViewOptions[DIRECTORY],
      value: DIRECTORY,
      selected: view === DIRECTORY,
      onClick: () =>
        router.push(
          `/employee-management/employee?view=${DIRECTORY}${isDraft ? "&isDraft=true" : ""}`
        ),
    },
  ];

  return { buttonOptions };
}
